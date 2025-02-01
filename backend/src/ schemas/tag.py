from sqlalchemy import Column, Integer, String
from app.database.database import Base
from sqlalchemy.orm import relationship


class TagBase(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    # Relacionamento inverso para acessar os produtos relacionados a uma tag
    products = relationship(
        "ProductBase",
        secondary="product_tag_association",
        back_populates="tags",
    )
