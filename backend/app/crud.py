"""
CRUD helper functions for managing users and journal entries.

This module centralizes database operations for authentication, user
management, and journal entry lifecycle (create, read, update, delete),
so that FastAPI route handlers can stay thin and focused on HTTP concerns.
"""
from typing import Any

from pydantic import EmailStr
from sqlmodel import Session, select

from app.models import (
    User,
    UserUpdate,
    UserCreate,
    Entry,
    EntryCreate,
    EntryUpdate,
    EntriesPublic,
)
from app.core.security import get_password_hash, verify_password
import uuid


def authenticate_user(*, session: Session, email: str, password: str) -> User | None:
    """
    Authenticate a user by email and password.

    Args:
        session: Database session.
        email: Email address supplied by the user.
        password: Plain-text password supplied by the user.

    Returns:
        The matching `User` if credentials are valid; otherwise `None`.
    """
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_user(*, session: Session, user_to_create: UserCreate) -> User | None:
    """
    Create and persist a new user.

    The plain-text password from `user_to_create` is hashed and stored
    on the resulting `User` record.

    Args:
        session: Database session.
        user_to_create: Validated user creation payload.

    Returns:
        The newly created `User` instance.
    """
    user_data = user_to_create.dict(exclude={"password"})
    user = User(**user_data)
    user.hashed_password = get_password_hash(user_to_create.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    """
    Look up a user by email.

    Args:
        session: Database session.
        email: Email address to search for.

    Returns:
        The matching `User` or `None` if no record is found.
    """
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    return user


def update_user(
    *, session: Session, id: uuid.UUID, request_data: UserUpdate
) -> Any | None:
    """
    Partially update an existing user.

    Only fields present in `request_data` (i.e. non-unset) are applied.

    Args:
        session: Database session.
        id: ID of the user to update.
        request_data: Pydantic model containing the new values.

    Returns:
        The updated `User` instance, or `None` if the user does not exist.
    """
    new_data = request_data.model_dump(exclude_unset=True)
    current_user = session.get(User, id)
    if not current_user:
        return None

    current_user.sqlmodel_update(new_data)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


def delete_user(*, session: Session, user: User) -> None:
    """
    Permanently delete a user.

    Args:
        session: Database session.
        user: The user instance to delete.
    """
    session.delete(user)
    session.commit()


def create_entry(
    *, session: Session, user: User, entry_to_create: EntryCreate
) -> Entry | None:
    """
    Create a new journal entry owned by the given user.

    Args:
        session: Database session.
        user: The owning user.
        entry_to_create: Validated entry creation payload.

    Returns:
        The newly created `Entry` instance.
    """
    entry = Entry(**entry_to_create.dict())
    entry.user_id = user.id
    entry.user = user
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


def get_entry_by_id(
    *, session: Session, id: uuid.UUID, user_id: uuid.UUID
) -> Any:
    """
    Retrieve a single entry by ID, scoped to a specific user.

    Args:
        session: Database session.
        id: ID of the entry to fetch.
        user_id: ID of the user who must own the entry.

    Returns:
        The matching `Entry`, or `None` if it does not exist or is not
        owned by the given user.
    """
    entry = session.get(Entry, id)
    if not entry or entry.user_id != user_id:
        return None
    return entry


def get_all_entries(*, session: Session) -> Any:
    """
    Retrieve all entries in the system.

    Intended for admin/debug scenarios rather than user-facing endpoints.

    Args:
        session: Database session.

    Returns:
        An `EntriesPublic` wrapper containing all entries and their count.
    """
    entries = session.exec(select(Entry)).all()
    return EntriesPublic(data=entries, count=len(entries))


def get_all_entries_by_user_id(
    *, session: Session, user_id: uuid.UUID
) -> Any:
    """
    Retrieve all entries belonging to a specific user, newest first.

    Args:
        session: Database session.
        user_id: ID of the user whose entries to fetch.

    Returns:
        An `EntriesPublic` wrapper with the user's entries and count.
    """
    entries = (
        session.exec(
            select(Entry)
            .where(Entry.user_id == user_id)
            .order_by(Entry.created_at.desc())
        )
        .all()
    )
    return EntriesPublic(data=entries, count=len(entries))


def update_entry(
    *, session: Session, user: User, id: uuid.UUID, request_data: EntryUpdate
) -> Any:
    """
    Partially update an entry owned by the given user.

    Ownership is enforced by checking `entry.user_id` before applying updates.

    Args:
        session: Database session.
        user: The user attempting the update.
        id: ID of the entry to update.
        request_data: Pydantic model containing the updated fields.

    Returns:
        The updated `Entry` instance, or `None` if the entry does not exist
        or is not owned by the user.
    """
    current_entry = session.get(Entry, id)
    if not current_entry or current_entry.user_id != user.id:
        return None
    new_data = request_data.model_dump(exclude_unset=True)
    current_entry.sqlmodel_update(new_data)
    session.add(current_entry)
    session.commit()
    session.refresh(current_entry)
    return current_entry


def delete_entry(*, session: Session, user: User, entry: Entry) -> None:
    """
    Delete an entry if it is owned by the given user.

    Args:
        session: Database session.
        user: The user attempting the delete.
        entry: The entry instance to delete.
    """
    if entry.user_id != user.id:
        return
    session.delete(entry)
    session.commit()
