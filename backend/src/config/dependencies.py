from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import sessionmaker, Session
from .env import database

# Configuração do banco de dados
if database["START_DEV"]:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./picolynne_store_dev.db"
else:
    SQLALCHEMY_DATABASE_URL = (
        f"postgresql://{database['DB_USER']}:"
        f"{database['DB_PASSWORD']}@"
        f"{database['DB_HOST']}:"
        f"{database['DB_PORT']}/"
        f"{database['DB_NAME']}"
    )

# Criação da engine do banco de dados
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Sessão de banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos
Base: DeclarativeMeta = declarative_base()


# Função para obter a sessão do banco de dados
def get_db() -> Session:  # type: ignore
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
