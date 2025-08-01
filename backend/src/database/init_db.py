# Desc: Initialize database
from sqlalchemy.orm import Session
from .database import Base, engine, SessionLocal

# Importar todos os modelos para garantir que as tabelas sejam criadas
from ..schemas.category import CategoryBase  # noqa: F401
from ..schemas.tag import TagBase  # noqa: F401
from ..schemas.product_tag import ProductTagAssociation  # noqa: F401
from ..schemas.product import ProductBase  # noqa: F401
from ..schemas.sale import SaleBase  # noqa: F401
from ..schemas.sale_item import SaleItemBase  # noqa: F401
from ..schemas.customer import CustomerBase  # noqa: F401
from ..schemas.user import UserBase  # noqa: F401

# Criar usuário administrador
from ..service.user_service import UserService
from ..config.env import security
from ..typings.user_typing import UserCreate


def create_admin_user(db: Session):
    user_service = UserService(db)
    admin_user = UserCreate(
        username=security["ADMIN_USER"],
        password=security["ADMIN_PASSWORD"],
        role="admin",
    )
    user_service.create_user(admin_user)


def init_database():
    try:
        # Criar todas as tabelas
        Base.metadata.create_all(bind=engine)
        print("Database initialized")
        # Criar usuário administrador
        db = SessionLocal()
        create_admin_user(db)
        db.close()
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise e

    return True
