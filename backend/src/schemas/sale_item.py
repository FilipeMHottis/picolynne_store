from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database.database import Base


class SaleItemBase(Base):
    __tablename__ = "sale_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    sale_id: Mapped[int] = mapped_column(ForeignKey("sales.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    product_name: Mapped[str] = mapped_column(nullable=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=True
    )
    category_name: Mapped[str] = mapped_column(nullable=True)
    quantity: Mapped[int] = mapped_column(nullable=True)
    price: Mapped[float] = mapped_column(nullable=True)

    sale = relationship("SaleBase", back_populates="sale_items")
    product = relationship("ProductBase", back_populates="sale_items")
    category = relationship("CategoryBase", back_populates="sale_items")
