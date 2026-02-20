import os
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Loads the key you just added to .env
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
SARVAM_URL = "https://api.sarvam.ai/vlm/extract"

class PrescriptionData(BaseModel):
    patient_name: str
    blood_group: str
    units_required: int
    urgency: str
    confidence_score: float
    needs_manual_approval: bool

@router.post("/extract-prescription", response_model=PrescriptionData)
async def extract_prescription(file: UploadFile = File(...)):
    if not SARVAM_API_KEY:
        raise HTTPException(status_code=500, detail="Sarvam API Key not configured in .env")

    contents = await file.read()
    
    async with httpx.AsyncClient() as client:
        try:
            # VLM call optimized for Indian multilingual prescriptions [cite: 875, 898]
            response = await client.post(
                SARVAM_URL,
                headers={"api-subscription-key": SARVAM_API_KEY},
                files={"file": (file.filename, contents, file.content_type)},
                data={
                    "prompt": "Extract the following from this medical prescription into JSON: patient_name, blood_group, units_required, urgency."
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Sarvam AI service error")
            
            data = response.json()
            
            # Implement Human-in-the-Loop Fallback logic [cite: 877]
            # If confidence is below 85%, mark for manual Clinic approval
            confidence = data.get("confidence_score", 0)
            needs_approval = True if confidence < 0.85 else False
            
            return {
                "patient_name": data.get("patient_name", "Unknown"),
                "blood_group": data.get("blood_group", "Unknown"),
                "units_required": data.get("units_required", 1),
                "urgency": data.get("urgency", "Routine"),
                "confidence_score": confidence,
                "needs_manual_approval": needs_approval
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Extraction Failed: {str(e)}")