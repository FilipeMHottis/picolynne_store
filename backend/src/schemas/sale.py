from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from ..database.database import Base


class SaleBase(Base):
    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    date: Mapped[datetime] = mapped_column(
        nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    total_quantity: Mapped[float] = mapped_column(nullable=True)
    total_price: Mapped[float] = mapped_column(nullable=True)

    customer = relationship("CustomerBase", back_populates="sales")
    sale_items = relationship("SaleItemBase", back_populates="sale")
