from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException

from app.core.config import settings
from app.core.security import create_access_token

from app.api.deps import SessionDep, CurrentUser
from fastapi.security import OAuth2PasswordRequestForm

from app.models import Token, UserPublic
from app import crud

router = APIRouter(tags=["login"])

@router.post("/login/access-token")
def login_access_token(
        session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    user = crud.authenticate_user(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=401, detail="Incorrect email or password"
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRY)
    return Token(
        access_token=create_access_token({"sub": user.id}, expires_delta=access_token_expires)
    )

@router.post("/login/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    return current_user