from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from ..database.database import Base
from .product import ProductBase


class CategoryBase(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    price = Column(Float)
    price_above_20_units = Column(Float)
    price_above_50_units = Column(Float)

    products = relationship("ProductBase", back_populates="category")
