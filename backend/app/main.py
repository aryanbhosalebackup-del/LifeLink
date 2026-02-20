from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.routers import auth, ai_vision, requests

# Lifespan context manager handles the startup and shutdown of the DB connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize MongoDB connection via Beanie
    await init_db()
    yield
    # Shutdown logic (if any) goes here

# Initialize FastAPI with the LifeLink metadata
app = FastAPI(
    title="LifeLink API",
    description="Intelligent Local Blood Ecosystem Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS so your React frontend (Vite) can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Standard Vite port
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root/Health check endpoint
@app.get("/")
async def root():
    return {
        "status": "online", 
        "message": "LifeLink API is running smoothly.",
        "version": "1.0.0"
    }

# Unified Authentication Router (Smart Identifier Gateway)
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# AI Vision Router (Sarvam VLM Prescription OCR)
app.include_router(ai_vision.router, prefix="/ai", tags=["AI Vision"])
app.include_router(requests.router, prefix="/requests", tags=["Blood Requests"])
from app.routers import inventory
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])

# Note: You can add Geo-Spatial or Inventory routers here as you build them