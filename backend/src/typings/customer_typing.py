from pydantic import BaseModel
from typing import Optional


class Customer(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    phone_number: str

    class Config:
        from_attributes = True
        populate_by_name = True
