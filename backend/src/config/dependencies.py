from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from .env import database

type ConnectArgs = dict[str, str | int]


# Configuração do banco de dados
def _get_database_url() -> str:
    if database["START_DEV"]:
        return "sqlite:///./picolynne_store_dev.db"
    else:
        return (
            f"postgresql://{database['DB_USER']}:"
            f"{database['DB_PASSWORD']}@"
            f"{database['DB_HOST']}:"
            f"{database['DB_PORT']}/"
            f"{database['DB_NAME']}"
        )


def _get_connect_args() -> ConnectArgs:
    """
    Retorna os argumentos de conexão para o banco de dados.
    """
    if database["START_DEV"]:
        return {"check_same_thread": False}
    return {}


# Criação da engine do banco de dados
SQLALCHEMY_DATABASE_URL = _get_database_url()
connect_args = _get_connect_args()
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)

# Sessão de banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos
Base: DeclarativeMeta = declarative_base()


# Função para obter a sessão do banco de dados
def get_db() -> Generator[Session, None, None]:
    """
    Dependência do FastAPI que rende uma sessão de DB e garante o fechamento.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
