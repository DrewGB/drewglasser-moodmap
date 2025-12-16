"""
Routes for creating and retrieving journal entries.

All endpoints require an authenticated user and ensure that users can
only access their own entries. Filtering by the current user's ID is
handled in the CRUD layer.
"""

import uuid
from typing import Any

from fastapi import APIRouter, HTTPException

from app import crud
from app.models import EntryPublic, EntriesPublic, EntryCreate
from app.api.deps import SessionDep, CurrentUser

router = APIRouter(prefix="/entries", tags=["entries"])

@router.get("/", response_model=EntriesPublic)
def get_user_entries(*, session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Return all journal entries belonging to the authenticated user.

    Args:
        session: Database session dependency.
        current_user: The currently authenticated user.

    Returns:
        A collection of the user's journal entries, wrapped in
        an `EntriesPublic` response model.
    """
    # Crud layer handles ownership of entries making sure a user only recieves entries they own
    data = crud.get_all_entries_by_user_id(session=session, user_id=current_user.id)
    return data

@router.get("/{entry_id}", response_model=EntryPublic)
def get_entry(entry_id: uuid.UUID, *, session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Return a single journal entry by ID for the authenticated user.

    The lookup is scoped to the current user's ID so one user cannot
    retrieve another user's entry.

    Args:
        entry_id: UUID of the entry to retrieve.
        session: Database session dependency.
        current_user: The currently authenticated user.

    Raises:
        HTTPException: 404 if the entry does not exist for this user.

    Returns:
        The requested journal entry as an `EntryPublic` model.
    """
    entry = crud.get_entry_by_id(session=session, id=entry_id, user_id=current_user.id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@router.post("/", response_model=EntryPublic)
def create_entry(*, session: SessionDep, current_user: CurrentUser, body: EntryCreate) -> Any:
    """
    Create a new journal entry for the authenticated user.

    Args:
        session: Database session dependency.
        current_user: The currently authenticated user.
        body: Validated entry data (title, content, mood, etc.).

    Raises:
        HTTPException: 500 if for some reason no current user is present.

    Returns:
        The newly created journal entry as an `EntryPublic` model.
    """
    if not current_user:
        raise HTTPException(status_code=500, detail="No current user found")

    entry = crud.create_entry(session=session, user=current_user, entry_to_create=body)
    return entry