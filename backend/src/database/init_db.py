# Desc: Initialize database
from .database import Base, engine

# Schema imports
from ..schemas.category import CategoryBase  # noqa: F401
from ..schemas.tag import TagBase  # noqa: F401
from ..schemas.product_tag import ProductTagAssociation  # noqa: F401
from ..schemas.product import ProductBase  # noqa: F401
from ..schemas.sale import SaleBase  # noqa: F401
from ..schemas.sale_item import SaleItemBase  # noqa: F401
from ..schemas.customer import CustomerBase  # noqa: F401


def init_database():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database initialized")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise e

    return True
