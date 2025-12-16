"""
Database setup and initialization for MoodMap.

This module is responsible for:
- Creating the SQLModel engine from the configured DATABASE_URL
- Providing a Session generator suitable for dependency injection
- Initializing database tables on application startup
"""

from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

# Connection string loaded from application settings
DATABASE_URL = settings.DATABASE_URL

# Global SQLModel engine used throughout the application
# echo=True logs SQL statements to the console (useful during development)
engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    """
    Yield a database Session bound to the global engine.

    This helper can be used as a dependency in contexts where a
    generator-based session is preferred.

    Yields:
        A SQLModel Session instance.
    """
    with Session(engine) as session:
        yield session


def init_db():
    """
    Initialize the database schema.

    Imports the models to ensure they are registered with SQLModel's metadata,
    then creates all tables defined on the metadata if they do not already exist.
    """
    from app.models import User, Entry  # Import models so their tables are registered

    SQLModel.metadata.create_all(engine)
