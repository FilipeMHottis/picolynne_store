from pydantic import BaseModel
from typing import Optional


class Tag(BaseModel):
    id: Optional[int] = None
    name: str

    class Config:
        from_attributes = True
        populate_by_name = True
