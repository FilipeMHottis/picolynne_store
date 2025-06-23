from typing import Optional, List, TypedDict
from pydantic import BaseModel


class CustomerSale(TypedDict):
    id: int
    name: str


class SaleItem(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float


class SaleItemForCreate(TypedDict):
    product_id: int
    quantity: int


class Sale(BaseModel):
    id: Optional[int]
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
