"""
Dependency utilities for database sessions and authentication.

This module provides:
- get_db: FastAPI dependency that yields a database Session
- get_current_user: FastAPI dependency that validates a JWT and returns the User
- SessionDep / TokenDep / CurrentUser: typed aliases for dependency injection
"""

from collections.abc import Generator
from typing import Annotated

from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError

from app.core.config import settings

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from app.core.db import engine
from app.models import User, TokenData
import jwt

# OAuth2 scheme used by FastAPI to extract the bearer token
oauth2_schema = OAuth2PasswordBearer(tokenUrl="/login/access-token")


def get_db() -> Generator[Session, None, None]:
    """
    Yield a database session for the duration of a request.

    Uses the global SQLModel engine to open a Session and ensures that it is
    properly closed after the request is handled.
    """
    with Session(engine) as session:
        yield session


# Typed dependency aliases used throughout the application
SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(oauth2_schema)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    """
    Resolve and return the current authenticated user from a JWT access token.

    The token is decoded using the configured JWT secret and algorithm, then
    validated against the TokenData schema. The `sub` claim is used to look up
    the corresponding User record in the database.

    Args:
        session: Database session dependency.
        token: Raw JWT access token extracted from the Authorization header.

    Raises:
        HTTPException: 401 if the token is invalid, malformed, expired,
        or if no matching user is found in the database.

    Returns:
        User: The authenticated User instance.
    """
    try:
        # Decode the token and validate the expected payload shape
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        token_data = TokenData(**payload)
    except (InvalidTokenError, ValidationError):
        # Token is invalid or doesn't match the expected schema
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    # Fetch the user referenced by the token subject
    user: User | None = session.get(User, token_data.sub)
    if not user:
        # No user matches the token subject
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    return user


# Dependency alias for endpoints that require an authenticated User
CurrentUser = Annotated[User, Depends(get_current_user)]
