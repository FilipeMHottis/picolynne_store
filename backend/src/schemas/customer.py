from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship
from ..database.database import Base


class CustomerBase(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(unique=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    phone_number: Mapped[str] = mapped_column(unique=True, index=True)

    sales = relationship("SaleBase", back_populates="customer")
