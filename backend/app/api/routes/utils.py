from fastapi import APIRouter
from typing import Any

router = APIRouter(prefix="/utils", tags=["utils"])

@router.get("/check-running")
def check_running() -> Any :
    return {"status": "running"}