from sqlalchemy import Column, Integer, String, Float
from app.database.database import Base


class CategoryBase(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    price = Column(Float)
    price_above_20_units = Column(Float)
    price_above_50_units = Column(Float)
