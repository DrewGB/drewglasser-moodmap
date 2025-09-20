from fastapi import APIRouter
from app.api.routes import utils, login, users

api_router = APIRouter()
api_router.include_router(utils.router)
api_router.include_router(users.router)
api_router.include_router(login.router)