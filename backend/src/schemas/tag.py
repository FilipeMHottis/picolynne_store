from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database.database import Base
from .product_tag import ProductTagAssociation


class TagBase(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)

    products = relationship(
        "ProductBase",
        secondary=ProductTagAssociation,
        back_populates="tags",
    )
