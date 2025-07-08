from typing import Optional, List, TypedDict
from pydantic import BaseModel
from datetime import datetime, timezone


class CustomerSale(TypedDict):
    id: int
    name: str


class SaleItem(BaseModel):
    id: Optional[int]
    sale_id: Optional[int]
    product_id: int
    product_name: str
    category_id: int
    category_name: str
    quantity: int
    price: float


class SaleItemForCreate(TypedDict):
    product_id: int
    quantity: int


class Sale(BaseModel):
    id: Optional[int]
    date: Optional[datetime] = datetime.now(timezone.utc)
    customer: CustomerSale
    items: List[SaleItem]
    total_quantity: int
    total_price: float


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int


class SaleCreate(BaseModel):
    customer_id: int
    items: List[SaleItemCreate]

    class Config:
        from_attributes = True
        populate_by_name = True
