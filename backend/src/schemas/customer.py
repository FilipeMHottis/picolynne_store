from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database.database import Base


class CustomerBase(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, unique=True, index=True)

    sales = relationship("SaleBase", back_populates="customer")
