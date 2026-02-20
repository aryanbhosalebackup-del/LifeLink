from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.models.inventory import BloodUnit
from app.models.users import User
from app.core.security import get_current_user
from datetime import datetime, timedelta, timezone
import random

router = APIRouter()

class BloodUnitCreate(BaseModel):
    blood_group: str
    component_type: str = "Whole Blood"
    quantity: int = 1 # Number of units to add
    collection_date: datetime = None

@router.get("/", response_model=List[BloodUnit])
async def get_inventory(current_user: dict = Depends(get_current_user)):
    # In a real app, filtering by institution_id would happen here
    # For this demo, we return all units to show the "Network" view
    units = await BloodUnit.find_all().to_list()
    return units

@router.post("/add", status_code=status.HTTP_201_CREATED)
async def add_units(data: BloodUnitCreate, current_user: dict = Depends(get_current_user)):
    user = await User.find_one(User.smart_id == current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Institution Name/ID from user profile
    institution = user.full_name 

    new_units = []
    
    # Default collection date to now if not provided
    c_date = data.collection_date or datetime.now(timezone.utc)
    # Expiry for Whole Blood is typically 35-42 days. Let's say 42.
    e_date = c_date + timedelta(days=42)

    for _ in range(data.quantity):
        # Generate a mock ISBT-128 ID
        isbt_id = f"W{random.randint(1000, 9999)} {random.randint(10000, 99999)} {random.randint(10, 99)}"
        
        unit = BloodUnit(
            isbt_id=isbt_id,
            component_type=data.component_type,
            blood_group=data.blood_group,
            collection_date=c_date,
            expiry_date=e_date,
            institution_id=institution,
            status="Available"
        )
        new_units.append(unit)

    if new_units:
        await BloodUnit.insert_many(new_units)
        
        # --- Back-in-Stock Trigger ---
        # Check if any Pending requests can now be fulfilled
        from app.models.requests import BloodRequest
        
        pending_requests = await BloodRequest.find(
            BloodRequest.blood_group == data.blood_group,
            BloodRequest.status == "Pending"
        ).sort(+BloodRequest.created_at).to_list() # FIFO

        remaining_new = data.quantity # Simpler tracking for this batch
        
        for req in pending_requests:
            # We need to check TOTAL available, not just what we added
            # But for efficiency, we can check if we likely have enough now
             available = await BloodUnit.find(
                BloodUnit.blood_group == data.blood_group,
                BloodUnit.status == "Available"
            ).count()
             
             if available >= req.units_needed:
                 # Auto-Approve
                 units_to_reserve = await BloodUnit.find(
                    BloodUnit.blood_group == data.blood_group,
                    BloodUnit.status == "Available"
                 ).limit(req.units_needed).to_list()
                 
                 for u in units_to_reserve:
                     u.status = "Reserved"
                     await u.save()
                
                 req.status = "Approved"
                 req.fulfilled_by = "LifeLink Auto-Allocation"
                 await req.save()
                 print(f"Auto-Approved Request {req.id}")

    return {"message": f"Successfully added {data.quantity} units", "units": new_units}

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_unit(id: str, current_user: dict = Depends(get_current_user)):
    unit = await BloodUnit.get(id)
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    await unit.delete()
    return None
