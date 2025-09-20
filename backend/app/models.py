import datetime
import uuid

from pydantic import EmailStr, BaseModel
from sqlmodel import Field, SQLModel, Relationship

class UserBase(SQLModel):
    email: str = Field(nullable=False, unique=True, index=True, max_length=255)
    first_name: str = Field(nullable=False, min_length=1, max_length=30)
    last_name: str = Field(nullable=False, min_length=1, max_length=30)

class UserCreate(UserBase):
    password: str = Field(nullable=False, min_length=8, max_length=40)

class UserUpdate(SQLModel):
    email: str | None = Field(default=None, max_length=255)
    first_name: str | None = Field(default=None, min_length=1, max_length=30)
    last_name: str | None = Field(default=None, min_length=1, max_length=30)

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    entries: list["Entry"] = Relationship(back_populates="user")

class UserPublic(UserBase):
    id: uuid.UUID

class EntryBase(SQLModel):
    mood: int = Field(nullable=False, ge=1, le=10)
    title: str = Field(nullable=False, min_length=1, max_length=255)
    body: str | None = Field(nullable=True, default=None)

class EntryCreate(EntryBase):
    pass

class EntryUpdate(SQLModel):
    mood: int | None = Field(default=None, ge=1, le=10)
    title: str | None = Field(default=None, min_length=1, max_length=255)
    body: str | None = Field(default=None)

class Entry(EntryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    user: User | None = Relationship(back_populates="entries")
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

class EntryPublic(EntryBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime

class EntriesPublic(SQLModel):
    data: list[EntryPublic]
    count: int

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    sub: uuid.UUID | None = None
