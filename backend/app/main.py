from fastapi import FastAPI
from app.api.main import api_router
from app.core.db import init_db

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to MoodMap"}

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(api_router)
