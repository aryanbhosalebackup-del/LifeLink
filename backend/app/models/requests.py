from beanie import Document, Link
from pydantic import Field
from typing import Optional, List
from datetime import datetime, timezone
from app.models.users import User

class BloodRequest(Document):
    requester: Link[User]
    blood_group: str
    units_needed: int
    hospital_name: Optional[str] = None
    urgency: str = "Standard" # Standard, Urgent, Critical
    status: str = "Pending" # Pending, Fulfilled, Cancelled
    status: str = "Pending" # Pending, Fulfilled, Cancelled
    fulfilled_by: Optional[str] = None # Name of Hospital/Bank
    broadcasted_to: Optional[List[str]] = [] # List of Donor Smart IDs
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "blood_requests"
