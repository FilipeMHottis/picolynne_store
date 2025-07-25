from ..config.env import database
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


if database["START_DEV"]:
    DATABASE_URL = "sqlite:///./picolynne_store_dev.db"
    connect_args = {"check_same_thread": False}
else:
    DATABASE_URL = (
        f"postgresql://{database['DB_USER']}:"
        f"{database['DB_PASSWORD']}@"
        f"{database['DB_HOST']}:"
        f"{database['DB_PORT']}/"
        f"{database['DB_NAME']}"
    )
    connect_args = {}


engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
