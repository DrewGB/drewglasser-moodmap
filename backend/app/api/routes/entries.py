import uuid
from typing import Any

from fastapi import APIRouter, HTTPException

from app import crud
from app.models import EntryPublic, EntriesPublic, EntryCreate
from app.api.deps import SessionDep, CurrentUser

router = APIRouter(prefix="/entries", tags=["entries"])

@router.get("/", response_model=EntriesPublic)
def get_user_entries(*, session: SessionDep, current_user: CurrentUser) -> Any:
    data = crud.get_all_entries_by_user_id(session=session, user_id=current_user.id)
    return data

@router.get("/{entry_id}", response_model=EntryPublic)
def get_entry(entry_id: uuid.UUID, *, session: SessionDep, current_user: CurrentUser) -> Any:
    entry = crud.get_entry_by_id(session=session, id=entry_id, user_id=current_user.id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@router.post("/", response_model=EntryPublic)
def create_entry(*, session: SessionDep, current_user: CurrentUser, body: EntryCreate) -> Any:
    if not current_user:
        raise HTTPException(status_code=500, detail="No current user found")

    entry = crud.create_entry(session=session, user=current_user, entry_to_create=body)
    return entry