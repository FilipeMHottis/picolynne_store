from sqlalchemy import Table, Column, Integer, ForeignKey
from ..database.database import Base

ProductTagAssociation = Table(
    "product_tag_association",
    Base.metadata,
    Column("product_id", Integer, ForeignKey("products.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)
