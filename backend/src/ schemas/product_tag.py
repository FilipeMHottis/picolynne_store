from sqlalchemy import Column, Integer, ForeignKey
from app.database.database import Base


class ProductTagAssociation(Base):
    __tablename__ = "product_tag_association"

    product_id = Column(Integer, ForeignKey("products.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)
