from typing import Optional, List
from pydantic import BaseModel
from .category_typing import Category
from .tag_typing import Tag


class Product(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    category: Category
    tags: List[Tag] = []

    class Config:
        from_attributes = True
        populate_by_name = True


class ProductCreate(BaseModel):
    name: str
    description: str
    category_id: int
    tags_id: List[int] = []

    class Config:
        from_attributes = True
        populate_by_name = True
