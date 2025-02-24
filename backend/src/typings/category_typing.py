from typing import Optional
from pydantic import BaseModel


class Category(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    price_above_20_units: float
    price_above_50_units: float

    class Config:
        from_attributes = True
        populate_by_name = True
