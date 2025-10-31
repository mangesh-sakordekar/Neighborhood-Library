from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from typing import Optional

# Database utilities - expose helpers so tests can create an in-memory engine
DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./library.db"

def _create_engine(database_url: str):
	connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
	return create_engine(database_url, pool_pre_ping=True, connect_args=connect_args)

# default engine used by the application
engine = _create_engine(DATABASE_URL)

# default sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# helper for tests to create a sessionmaker from a custom engine/url
def get_engine(database_url: Optional[str] = None):
	url = database_url or DATABASE_URL
	return _create_engine(url)

def get_sessionmaker_from_engine(engine):
	return sessionmaker(autocommit=False, autoflush=False, bind=engine)

