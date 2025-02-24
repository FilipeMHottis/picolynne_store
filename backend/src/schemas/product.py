from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database.database import Base
from .product_tag import ProductTagAssociation


class ProductBase(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))

    category = relationship(
        "CategoryBase",
        back_populates="products",
        foreign_keys=[category_id],
    )

    tags = relationship(
        "TagBase",
        secondary=ProductTagAssociation,
        back_populates="products",
    )

    sale_items = relationship("SaleItemBase", back_populates="product")
