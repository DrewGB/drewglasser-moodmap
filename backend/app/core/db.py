from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    from app.models import User, Entry

    SQLModel.metadata.create_all(engine)