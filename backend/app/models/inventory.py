from beanie import Document
from pydantic import Field
from datetime import datetime, timezone

class BloodUnit(Document):
    isbt_id: str = Field(..., unique=True, description="Global ISBT-128 Tracking ID")
    component_type: str = Field(..., description="Whole Blood, Red Cells, Platelets, etc.")
    blood_group: str
    collection_date: datetime
    expiry_date: datetime
    status: str = Field(default="Available", description="Available, Reserved, Quarantined, Expired")
    
    # The ID of the Hospital or Blood Bank that currently holds this unit
    institution_id: str 

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "inventory"