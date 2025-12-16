"""
Security utilities for MoodMap authentication.

This module provides helpers for:
- Hashing and verifying user passwords with bcrypt (via passlib)
- Creating signed JWT access tokens with configurable expiry
"""

import uuid
from datetime import datetime, timedelta

import jwt
from passlib.context import CryptContext

from app.core.config import settings

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Create a signed JWT access token from the given payload.

    - Converts UUID values to strings so they can be encoded in JSON.
    - Adds an `exp` (expiry) claim based on the provided `expires_delta`
      or a default of 15 minutes.
    - Signs the token using the app's JWT secret and algorithm.

    Args:
        data: Payload dictionary to encode into the token.
        expires_delta: Optional timedelta for how long the token is valid.

    Returns:
        Encoded JWT access token as a string.
    """
    to_encode = data.copy()

    # Ensure all UUIDs are serialized as strings before encoding
    for key, value in to_encode.items():
        if isinstance(value, uuid.UUID):
            to_encode[key] = str(value)

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify that a plain-text password matches a stored bcrypt hash.

    Args:
        plain_password: The password provided by the user.
        hashed_password: The bcrypt-hashed password stored in the database.

    Returns:
        True if the password is valid for the hash, otherwise False.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a plain-text password using bcrypt for secure storage.

    Args:
        password: The plain-text password to hash.

    Returns:
        A bcrypt hash suitable for persisting in the database.
    """
    return pwd_context.hash(password)
