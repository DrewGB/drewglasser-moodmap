from typing import Any

from fastapi import APIRouter, HTTPException

from app import crud
from app.models import EntryPublic, EntriesPublic, EntryCreate
from app.api.deps import SessionDep, CurrentUser

router = APIRouter(prefix="/entries", tags=["entries"])

@router.get("/", response_model=EntriesPublic)
def get_all_entries(*, session: SessionDep) -> Any:
    data = crud.get_all_entries(session=session)
    return data

@router.post("/", response_model=EntryPublic)
def create_entry(*, session: SessionDep, current_user: CurrentUser, body: EntryCreate) -> Any:
    if not current_user:
        raise HTTPException(status_code=500, detail="No current user found")

    entry = crud.create_entry(session=session, user=current_user, entry_to_create=body)
    return entry