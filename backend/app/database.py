from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings
import importlib
import sys

# Determine DB URL; fall back to in-memory SQLite when psycopg2 is unavailable
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
try:
    # If the configured URL targets Postgres but psycopg2 isn't installed, fall back
    if db_url.startswith("postgres"):
        if importlib.util.find_spec("psycopg2") is None:
            db_url = "sqlite:///:memory:"
            print("[warning] psycopg2 not available, using in-memory SQLite for tests.")
except Exception:
    db_url = settings.DATABASE_URL

# Setup engine
engine = create_engine(
    db_url,
    pool_pre_ping=True
)

# Local session constructor
SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)

# Base class for DB models mapping
Base = declarative_base()

# DB dependency injector for routing operations
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
