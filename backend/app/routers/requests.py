from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from app.models.requests import BloodRequest
from app.models.users import User
from app.models.inventory import BloodUnit
from app.core.security import get_current_user
from beanie.operators import In

router = APIRouter()

class RequestCreate(BaseModel):
    blood_group: str
    units: int
    hospital: str = None
    urgency: str = "Standard"

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_request(req: RequestCreate, current_user: dict = Depends(get_current_user)):
    # Find the user making the request
    user = await User.find_one(User.smart_id == current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    
    # 1. Check Inventory (Blood Banks/Hospitals)
    # Find available units of the requested blood group
    available_units = await BloodUnit.find(
        BloodUnit.blood_group == req.blood_group,
        BloodUnit.status == "Available"
    ).limit(req.units).to_list()

    request_status = "Pending"
    fulfilled_by = None
    broadcast_list = []

    if len(available_units) >= req.units:
        # Auto-Approve!
        request_status = "Approved"
        fulfilled_by = "LifeLink Network" # or the specific institution if tracked
        
        # Reserve the units
        for unit in available_units:
            unit.status = "Reserved"
            await unit.save()
    else:
        # 2. Broadcast to Donors
        # Logic: Same Blood Group OR O- (Universal)
        compatible_groups = [req.blood_group]
        if req.blood_group != "O-":
            compatible_groups.append("O-")
            
        donors = await User.find(
            User.role == "donor",
            In(User.blood_group, compatible_groups)
        ).to_list()
        
        broadcast_list = [d.smart_id for d in donors]

    new_request = BloodRequest(
        requester=user,
        blood_group=req.blood_group,
        units_needed=req.units,
        hospital_name=req.hospital,
        urgency=req.urgency,
        status=request_status,
        fulfilled_by=fulfilled_by,
        broadcasted_to=broadcast_list
    )
    
    await new_request.insert()
    
    return {
        "message": "Blood request processed", 
        "status": request_status,
        "request_id": str(new_request.id),
        "broadcast_count": len(broadcast_list)
    }

@router.get("/my-requests")
async def get_my_requests(current_user: dict = Depends(get_current_user)):
    user = await User.find_one(User.smart_id == current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    requests = await BloodRequest.find(BloodRequest.requester.id == user.id).sort(-BloodRequest.created_at).to_list()
    return requests

@router.get("/all")
async def get_all_requests(current_user: dict = Depends(get_current_user)):
    # Accessible by Blood Bank / Hospital
    requests = await BloodRequest.find_all().sort(-BloodRequest.created_at).to_list()
    return requests

@router.get("/broadcasts")
async def get_broadcasts(current_user: dict = Depends(get_current_user)):
    # Requests broadcasted to THIS user
    user_id = current_user["sub"]
    requests = await BloodRequest.find(
        In(BloodRequest.broadcasted_to, [user_id]),
        BloodRequest.status == "Pending"
    ).sort(-BloodRequest.created_at).to_list()
    return requests

@router.post("/{req_id}/fulfill")
async def fulfill_request(req_id: str, current_user: dict = Depends(get_current_user)):
    # Manual Approval by Blood Bank
    req = await BloodRequest.get(req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if req.status != "Pending":
        raise HTTPException(status_code=400, detail="Request already processed")

    # Check Stock
    available_units = await BloodUnit.find(
        BloodUnit.blood_group == req.blood_group,
        BloodUnit.status == "Available"
    ).limit(req.units_needed).to_list()

    if len(available_units) < req.units_needed:
        raise HTTPException(status_code=400, detail="Insufficient stock to approve")

    # Reserve Units
    for unit in available_units:
        unit.status = "Reserved"
        await unit.save()

    req.status = "Approved"
    req.fulfilled_by = "Blood Bank (Manual)"
    await req.save()
    return {"message": "Request Approved Manually"}

@router.post("/{req_id}/dispatch")
async def dispatch_request(req_id: str, current_user: dict = Depends(get_current_user)):
    # Distribution Step
    req = await BloodRequest.get(req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if req.status != "Approved":
        raise HTTPException(status_code=400, detail="Request must be Approved first")

    # In a real app, we would find the specific reserved units and mark them Dispatched.
    # For now, we update the request status.
    req.status = "Dispatched"
    await req.save()
    return {"message": "Blood Units Dispatched"}

@router.post("/{req_id}/donate")
async def donate_request(req_id: str, current_user: dict = Depends(get_current_user)):
    # Donor accepts request
    req = await BloodRequest.get(req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if req.status != "Pending":
        raise HTTPException(status_code=400, detail="Request no longer pending")

    user = await User.find_one(User.smart_id == current_user["sub"])
    
    req.status = "Fulfilled" # Or "Donor Accepted"
    req.fulfilled_by = f"Donor: {user.full_name}"
    await req.save()
    return {"message": "Thank you for donating!"}
