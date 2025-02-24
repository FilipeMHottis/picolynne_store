from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database.database import Base
from .product_tag import ProductTagAssociation


class TagBase(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    products = relationship(
        "ProductBase",
        secondary=ProductTagAssociation,
        back_populates="tags",
    )
