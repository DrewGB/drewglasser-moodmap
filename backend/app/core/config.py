"""
Application configuration module for the MoodMap backend.

This module defines the Settings class, which loads configuration
from environment variables (via pydantic-settings), including:

- JWT configuration (secret and algorithm)
- Access token expiry duration
- Database connection URL
- Frontend host URL
- Backend CORS origins and a derived list of allowed CORS origins

An instance of `Settings` is created at the bottom of the file and
is intended to be imported wherever configuration values are needed.
"""

from pydantic_settings import BaseSettings
from typing import Any, Annotated

from pydantic import AnyUrl, BeforeValidator, computed_field


def parse_cors(v: Any) -> list[str] | str:
    """
    Normalize CORS origin configuration into a list of strings.

    This helper supports:
    - A comma-separated string of origins: "http://a.com, http://b.com"
    - A list of origins that is already in the desired format

    Args:
        v: Raw value from the environment (string or list).

    Returns:
        A list of stripped origin strings, or the original list/string
        if it already matches the expected format.

    Raises:
        ValueError: If the value type is not supported.
    """
    if isinstance(v, str) and not v.startswith("["):
        # Treat as a comma-separated string and split into a list
        return [i.strip() for i in v.split(",") if i.strip()]
    elif isinstance(v, list | str):
        # Already a list or a string representation that pydantic will handle
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    """
    Strongly-typed application settings loaded from environment variables.

    Attributes:
        JWT_SECRET: Secret key used to sign JWT access tokens.
        JWT_ALGORITHM: Algorithm used for JWT signing (e.g., "HS256").
        ACCESS_TOKEN_EXPIRY: Access token lifetime in minutes.
        DATABASE_URL: Database connection string for SQLModel.
        FRONTEND_HOST: Base URL of the frontend application.
        BACKEND_CORS_ORIGINS: Raw CORS origins configuration, parsed via `parse_cors`.
    """

    JWT_SECRET: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRY: int
    DATABASE_URL: str
    FRONTEND_HOST: str = "http://localhost:3000"

    # Accept either a list of URLs or a comma-separated string from the environment.
    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ]

    @computed_field
    @property
    def all_cors_origins(self) -> list[str]:
        """
        Combined list of allowed CORS origins.

        Returns:
            A list including:
            - All BACKEND_CORS_ORIGINS coerced to strings and stripped of trailing slashes
            - The FRONTEND_HOST value (also stripped of a trailing slash)
        """
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]

    class Config:
        # Load configuration values from a `.env` file in the project root
        env_file = ".env"


# Global settings instance used throughout the application
settings = Settings()  # type: ignore
