from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime, timezone

class User(Document):
    # Smart Identifier: Holds either a 10-digit phone number OR an institutional email
    smart_id: str = Field(..., unique=True, description="Phone number or Email")
    full_name: str
    password_hash: str
    role: str = Field(..., description="patient, donor, hospital, clinic, bloodbank")
    
    # Optional fields depending on the role
    blood_group: Optional[str] = None
    deferral_active_until: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users" # MongoDB collection name