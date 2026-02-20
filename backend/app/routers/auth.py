from fastapi import APIRouter, HTTPException, status
from datetime import timedelta
from pydantic import BaseModel
from app.models.users import User
from app.core.security import verify_password, create_access_token, get_password_hash, get_current_user
from fastapi import Depends
import app.core.security as security

router = APIRouter()

class LoginRequest(BaseModel):
    smart_id: str
    password: str

class RegisterRequest(BaseModel):
    smart_id: str
    full_name: str
    password: str
    role: str
    blood_group: str | None = None

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest):
    # Check if the Smart ID (Phone/Email) already exists
    existing_user = await User.find_one(User.smart_id == req.smart_id)
    if existing_user:
        raise HTTPException(status_code=400, detail="Smart Identifier already registered")
    
    hashed_pw = get_password_hash(req.password)
    
    new_user = User(
        smart_id=req.smart_id,
        full_name=req.full_name,
        password_hash=hashed_pw,
        role=req.role,
        blood_group=req.blood_group
    )
    
    await new_user.insert()
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(req: LoginRequest):
    print(f"DEBUG LOGIN: Attempting login for {req.smart_id}")
    # Dynamically query the database for the Smart Identifier
    user = await User.find_one(User.smart_id == req.smart_id)
    if not user:
        print(f"DEBUG LOGIN: User {req.smart_id} NOT FOUND")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    print(f"DEBUG LOGIN: User found. Role: {user.role}, Hash: {user.password_hash}")
    
    # Verify the hashed password
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Issue the JWT with the role embedded in the payload
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.smart_id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    user = await User.find_one(User.smart_id == current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Return user data excluding sensitive info
    return {
        "full_name": user.full_name,
        "smart_id": user.smart_id,
        "role": user.role,
        "blood_group": user.blood_group,
        "created_at": user.created_at
    }