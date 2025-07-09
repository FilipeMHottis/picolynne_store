from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship
from ..database.database import Base


class CategoryBase(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(unique=True, index=True)
    price: Mapped[float] = mapped_column(nullable=True)
    price_above_20_units: Mapped[float] = mapped_column(nullable=True)
    price_above_50_units: Mapped[float] = mapped_column(nullable=True)

    products = relationship("ProductBase", back_populates="category")
    sale_items = relationship(
        "SaleItemBase",
        back_populates="category",
        foreign_keys="SaleItemBase.category_id",
    )
