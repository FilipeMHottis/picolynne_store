from sqlalchemy import Column, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..database.database import Base


class SaleBase(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    total_quantity = Column(Integer)
    total_price = Column(Float)

    customer = relationship("CustomerBase", back_populates="sales")
    sale_items = relationship("SaleItemBase", back_populates="sale")
