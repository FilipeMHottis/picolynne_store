from typing import Optional, List
from pydantic import BaseModel
from .category_typing import Category
from .tag_typing import Tag


class Product(BaseModel):
    id: Optional[int] = None
    name: str
    img_link: str
    category: Category
    stock: Optional[int] = 0
    tags: List[Tag] = []

    class Config:
        from_attributes = True
        populate_by_name = True


class ProductCreate(BaseModel):
    name: str
    img_link: str
    stock: int = 0
    category_id: int
    tags_id: List[int] = []

    class Config:
        from_attributes = True
        populate_by_name = True
