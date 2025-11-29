from fastapi import APIRouter, HTTPException

from app import crud
from app.models import EntryPublic, EntriesPublic
from app.api.deps import SessionDep

router = APIRouter(prefix="/entries", tags=["entries"])

@router.get("/", response_model=EntriesPublic)
def get_all_entries(*, session: SessionDep):
    data = crud.get_all_entries(session=session)
    return data


