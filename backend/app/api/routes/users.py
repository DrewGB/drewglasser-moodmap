"""
Routes for dealing with user data

This file currently only contains one method for registering user accounts. Later it may contain editing and deleting routes
"""

from fastapi import APIRouter, HTTPException
from typing import Any

from app.models import UserPublic, UserCreate
from app.api.deps import SessionDep
from app import crud

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserPublic)
def create_user(*, session: SessionDep, body: UserCreate) -> Any:
    """
    This route will create a new user
    :param session: The database session to use
    :param body: User information to store in the database
    :return: The new user
    """
    user = crud.get_user_by_email(session=session, email=body.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    user = crud.create_user(session=session, user_to_create=body)
    return user
