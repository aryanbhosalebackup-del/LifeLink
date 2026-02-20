import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.users import User
from app.core.security import get_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

async def seed_users():
    # Connect to MongoDB
    client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
    await init_beanie(database=client.lifelink, document_models=[User])

    users = [
        {
            "smart_id": "hospital@lifelink.com",
            "full_name": "LifeLink General Hospital",
            "password": "password123",
            "role": "hospital"
        },
        {
            "smart_id": "clinic@lifelink.com",
            "full_name": "City Care Clinic",
            "password": "password123",
            "role": "clinic"
        },
        {
            "smart_id": "bloodbank@lifelink.com",
            "full_name": "Central Blood Bank",
            "password": "password123",
            "role": "bloodbank"
        },
        {
            "smart_id": "patient@lifelink.com",
            "full_name": "John Doe",
            "password": "password123",
            "role": "patient",
            "blood_group": "O+"
        }
    ]

    for user_data in users:
        existing = await User.find_one(User.smart_id == user_data["smart_id"])
        if not existing:
            hashed_pw = get_password_hash(user_data["password"])
            new_user = User(
                smart_id=user_data["smart_id"],
                full_name=user_data["full_name"],
                password_hash=hashed_pw,
                role=user_data["role"],
                blood_group=user_data.get("blood_group")
            )
            await new_user.insert()
            print(f"Created user: {user_data['smart_id']}")
        else:
            print(f"User already exists: {user_data['smart_id']}")

if __name__ == "__main__":
    asyncio.run(seed_users())
