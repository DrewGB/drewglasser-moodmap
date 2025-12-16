"""
Authentication and token endpoints for the MoodMap API.

This module exposes:
- POST /login/access-token: issue JWT access tokens for username/password login
- POST /login/test-token: convenience route to verify the token and return the current user
"""

from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException

from app.core.config import settings
from app.core.security import create_access_token

from app.api.deps import SessionDep, CurrentUser
from fastapi.security import OAuth2PasswordRequestForm

from app.models import Token, UserPublic
from app import crud

router = APIRouter(prefix="/login", tags=["login"])


@router.post("/access-token")
def login_access_token(
        session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    Authenticate a user and return a JWT access token.

    The OAuth2PasswordRequestForm provides `username` and `password`, which
    are validated against the database via `crud.authenticate_user`. On success,
    this issues a signed JWT with the user's ID in the `sub` claim.

    Args:
        session: Database session dependency.
        form_data: OAuth2 credentials containing the email (in `username`)
            and raw password.

    Raises:
        HTTPException: 401 if the credentials are invalid.

    Returns:
        Token: A JWT access token and token type (`bearer`).
    """
    print("Looking for user:")
    user = crud.authenticate_user(
        session=session, email=form_data.username, password=form_data.password
    )
    print(user)
    if not user:
        raise HTTPException(
            status_code=401, detail="Incorrect email or password"
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRY)
    return Token(
        access_token=create_access_token({"sub": user.id}, expires_delta=access_token_expires)
    )


@router.post("/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    """
    Return the authenticated user, validating the access token in the process.

    This endpoint relies on the `CurrentUser` dependency to resolve the user
    from the Authorization header. If the token is invalid or expired, the
    dependency will raise an HTTPException before this handler runs.

    Args:
        current_user: The authenticated user derived from the current access token.

    Returns:
        UserPublic: A public representation of the authenticated user.
    """
    return current_user
