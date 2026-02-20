from fastapi import APIRouter

router = APIRouter()

@router.get("/search-donors")
async def search_donors(lat: float, lon: float, radius: int = 10, blood_group: str = None):
    # Stub: Geo-spatial query using MongoDB $near or similar
    return {
        "results": [
            {"name": "Donor Stub 1", "distance": "2km", "blood_group": blood_group},
            {"name": "Blood Bank Stub A", "distance": "5km", "inventory": "Available"}
        ]
    }
