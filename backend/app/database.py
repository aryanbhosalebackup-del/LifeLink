import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv

# Import your new models!
from app.models.users import User
from app.models.inventory import BloodUnit
from app.models.requests import BloodRequest

load_dotenv()

async def init_db():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise ValueError("MONGO_URI environment variable not set.")

    client = AsyncIOMotorClient(mongo_uri)
    
    # Register the models
    await init_beanie(
        database=client.lifelink, 
        document_models=[
            User, 
            BloodUnit,
            BloodRequest
        ] 
    )
    print("MongoDB successfully connected and Beanie initialized! 🩸")