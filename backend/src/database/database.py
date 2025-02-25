from ..config.env import database
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


if database["START_DEV"]:
    DATABASE_URL = "sqlite:///./picolynne_store.dev.db"
else:
    DATABASE_URL = (
        f"postgresql://{database['DB_USER']}:"
        f"{database['DB_PASSWORD']}@"
        f"{database['DB_HOST']}:"
        f"{database['DB_PORT']}/"
        f"{database['DB_NAME']}"
    )


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if database["START_DEV"] else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
