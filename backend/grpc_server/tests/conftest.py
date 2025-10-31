import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base
from app.database import get_engine, get_sessionmaker_from_engine

# Use in-memory SQLite for tests
@pytest.fixture
def test_db():
    """Create a fresh database for each test."""
    engine = get_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    SessionLocal = get_sessionmaker_from_engine(engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(engine)

@pytest.fixture
def sample_book_data():
    """Sample book data for tests."""
    return {
        "title": "Test Book",
        "author": "Test Author"
    }

@pytest.fixture
def sample_member_data():
    """Sample member data for tests."""
    return {
        "name": "Test Member",
        "contact": "test@example.com"
    }