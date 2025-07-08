from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from ..database.database import Base
from .product_tag import ProductTagAssociation


class ProductBase(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(unique=True, index=True)
    img_link: Mapped[str] = mapped_column(nullable=True)
    stock: Mapped[int] = mapped_column(default=0)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))

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
