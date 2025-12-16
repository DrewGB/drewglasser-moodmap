"""
Pydantic/SQLModel models for MoodMap.

Defines:
- User models (DB model + create/update/public schemas)
- Entry models (DB model + create/update/public schemas)
- Container for paginated entry lists
- Auth token models for JWT-based authentication
"""

import datetime
import uuid

from pydantic import EmailStr, BaseModel
from sqlmodel import Field, SQLModel, Relationship


class UserBase(SQLModel):
    """
    Common user fields shared across multiple user-facing models.
    """
    # Unique email used as the primary login identifier
    email: str = Field(nullable=False, unique=True, index=True, max_length=255)
    # Basic profile fields
    first_name: str = Field(nullable=False, min_length=1, max_length=30)
    last_name: str = Field(nullable=False, min_length=1, max_length=30)


class UserCreate(UserBase):
    """
    Schema for creating a new user (input only).

    Extends UserBase by adding a plain-text password that will be
    hashed before storing in the database.
    """
    password: str = Field(nullable=False, min_length=8, max_length=40)


class UserUpdate(SQLModel):
    """
    Partial update schema for an existing user.

    All fields are optional; only provided values will be updated.
    """
    email: str | None = Field(default=None, max_length=255)
    first_name: str | None = Field(default=None, min_length=1, max_length=30)
    last_name: str | None = Field(default=None, min_length=1, max_length=30)


class User(UserBase, table=True):
    """
    Database model for a user account.

    Inherits core profile fields from UserBase and adds:
    - UUID primary key
    - hashed_password
    - created/updated timestamps
    - relationship to the user's journal entries
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    # One-to-many relationship: a user can have many entries
    entries: list["Entry"] = Relationship(back_populates="user")


class UserPublic(UserBase):
    """
    Public representation of a user returned by the API.

    Exposes non-sensitive user fields plus the user ID.
    """
    id: uuid.UUID


class EntryBase(SQLModel):
    """
    Common fields shared across all journal entry models.
    """
    # Mood score for the entry (1–10)
    mood: int = Field(nullable=False, ge=1, le=10)
    # Short title/summary for the entry
    title: str = Field(nullable=False, min_length=1, max_length=255)
    # Optional free-form journal text
    body: str | None = Field(nullable=True, default=None)


class EntryCreate(EntryBase):
    """
    Schema for creating a new journal entry.

    Reuses all fields from EntryBase.
    """
    pass


class EntryUpdate(SQLModel):
    """
    Partial update schema for an existing journal entry.

    All fields are optional; only provided values will be updated.
    """
    mood: int | None = Field(default=None, ge=1, le=10)
    title: str | None = Field(default=None, min_length=1, max_length=255)
    body: str | None = Field(default=None)


class Entry(EntryBase, table=True):
    """
    Database model for a journal entry.

    Includes:
    - UUID primary key
    - Foreign key to owning user
    - Relationship back to the User model
    - created_at / updated_at timestamps
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    # Many-to-one relationship: each entry belongs to a single user
    user: User | None = Relationship(back_populates="entries")
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)


class EntryPublic(EntryBase):
    """
    Public representation of a journal entry returned by the API.

    Exposes entry content and metadata but not relational details
    like the full User object.
    """
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime


class EntriesPublic(SQLModel):
    """
    Wrapper for a list of entries plus the total count.

    Useful for list endpoints and pagination responses.
    """
    data: list[EntryPublic]
    count: int


class Token(BaseModel):
    """
    Access token returned after successful authentication.

    Compatible with OAuth2 bearer token usage.
    """
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """
    Data extracted from a validated access token.

    Currently only stores the user ID (subject) as a UUID.
    """
    sub: uuid.UUID | None = None
