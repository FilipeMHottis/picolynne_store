import os
from dotenv import load_dotenv
from typing import TypedDict

load_dotenv()


#  Tipagem
class DatabaseConfig(TypedDict):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: str
    DB_NAME: str
    START_DEV: bool


class SecurityConfig(TypedDict):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    ADMIN_USER: str
    ADMIN_PASSWORD: str


class ServeConfig(TypedDict):
    PORT: int
    HOST: str


# Configurações
database: DatabaseConfig = {
    "DB_USER": os.getenv("DB_USER", "picolynne_store"),
    "DB_PASSWORD": os.getenv("DB_PASSWORD", "picolynne_store"),
    "DB_HOST": os.getenv("DB_HOST", "localhost"),
    "DB_PORT": os.getenv("DB_PORT", "5432"),
    "DB_NAME": os.getenv("DB_NAME", "picolynne_store"),
    "START_DEV": os.getenv("START_DEV", "true").lower() == "true",
}

security: SecurityConfig = {
    "SECRET_KEY": os.getenv("SECRET_KEY", "secret"),
    "ALGORITHM": os.getenv("ALGORITHM", "HS256"),
    "ACCESS_TOKEN_EXPIRE_MINUTES": int(
        os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            1440,
        )
    ),
    "ADMIN_USER": os.getenv("ADMIN_USER", "admin"),
    "ADMIN_PASSWORD": os.getenv("ADMIN_PASSWORD", "admin"),
}

serve_config: ServeConfig = {
    "PORT": int(os.getenv("PORT", 8000)),
    "HOST": os.getenv("HOST", "0.0.0.0"),
}
