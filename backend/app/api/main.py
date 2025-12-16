"""
Main API router configuration.

This module defines the top-level APIRouter for the application and
registers the individual route modules so they are exposed under a
single unified API router.
"""

from fastapi import APIRouter
from app.api.routes import utils, login, users, entries

# Create a root router that will be mounted in the main FastAPI app
api_router = APIRouter()

# Register sub-routers for different functional areas of the API
api_router.include_router(utils.router)   # Health checks / utility endpoints
api_router.include_router(users.router)   # User management endpoints
api_router.include_router(login.router)   # Authentication / login endpoints
api_router.include_router(entries.router) # Journal entries CRUD endpoints
