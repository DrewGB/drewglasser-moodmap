"""
Main FastAPI application for MoodMap.

This module configures the FastAPI app instance, sets up CORS middleware
for allowed frontend origins, initializes the database on startup, and
mounts the main API router.
"""

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.api.main import api_router
from app.core.db import init_db
from app.core.config import settings

# Create the FastAPI app instance
app = FastAPI()

# Enable CORS if any origins are configured in settings.
# This allows the frontend (e.g., Next.js) to call the API from a browser.
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Simple health / sanity-check endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to MoodMap"}

# Run database initialization (e.g., create tables) when the app starts up
@app.on_event("startup")
def on_startup():
    init_db()

# Register the main API router with all sub-routes (users, login, entries, etc.)
app.include_router(api_router)
