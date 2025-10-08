from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.api.main import api_router
from app.core.db import init_db
from app.core.config import settings

app = FastAPI()
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/")
async def root():
    return {"message": "Welcome to MoodMap"}

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(api_router)
