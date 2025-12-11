from typing import Any

from pydantic import EmailStr
from app.models import User, UserUpdate, UserCreate, Entry, EntryCreate, EntryUpdate, EntriesPublic
from sqlmodel import Session, select
from app.core.security import get_password_hash, verify_password
import uuid


def authenticate_user(*, session: Session , email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user

def create_user(*, session: Session, user_to_create: UserCreate) -> User | None:
    user_data = user_to_create.dict(exclude={"password"})
    user = User(**user_data)
    user.hashed_password = get_password_hash(user_to_create.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    return user

def update_user(*, session: Session, id: uuid.UUID, request_data: UserUpdate) -> Any | None:
    new_data = request_data.model_dump(exclude_unset=True)
    current_user = session.get(User, id)
    if not current_user:
        return None

    current_user.sqlmodel_update(new_data)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

def delete_user(*, session: Session, user: User):
    session.delete(user)
    session.commit()

def create_entry(*, session: Session, user: User, entry_to_create: EntryCreate) -> Entry | None:
    entry = Entry(**entry_to_create.dict())
    entry.user_id = user.id
    entry.user = user
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry

def get_entry_by_id(*, session: Session, id: uuid.UUID, user_id: uuid.UUID) -> Any:
    entry = session.get(Entry, id)
    if not entry or entry.user_id != user_id:
        return None
    return entry

def get_all_entries(*, session: Session) -> Any:
    entries = session.exec(select(Entry)).all()
    return EntriesPublic(data=entries, count=len(entries))

def get_all_entries_by_user_id(*, session: Session, user_id: uuid.UUID) -> Any:
    entries = session.exec(select(Entry).where(Entry.user_id == user_id).order_by(Entry.created_at.desc())).all()
    return EntriesPublic(data=entries, count=len(entries))

def get_recent_entries(*, session: Session, user_id, limit) -> Any:
    entries = session.exec(
        select(Entry).where(Entry.user_id == user_id).order_by(Entry.created_at.desc()).limit(limit)
    ).all()
    return EntriesPublic(data=entries, count=len(entries))

def update_entry(*, session: Session, id: uuid.UUID, request_data: EntryUpdate) -> Any:
    current_entry = session.get(Entry, id)
    if not current_entry:
        return None
    new_data = request_data.model_dump(exclude_unset=True)
    current_entry.sqlmodel_update(new_data)
    session.add(current_entry)
    session.commit()
    session.refresh(current_entry)
    return current_entry

def delete_entry(*, session: Session, entry: Entry):
    session.delete(entry)
    session.commit()