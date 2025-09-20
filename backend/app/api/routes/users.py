from fastapi import APIRouter, HTTPException
from typing import Any

from app.models import UserPublic, UserCreate
from app.api.deps import SessionDep
from app import crud

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserPublic)
def create_user(*, session: SessionDep, body: UserCreate) -> Any:
    user = crud.get_user_by_email(session=session, email=body.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    user = crud.create_user(session=session, user_to_create=body)
    return user

