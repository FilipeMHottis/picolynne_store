from pydantic import BaseModel
from typing import Generic, TypeVar


T = TypeVar("T")


class Response(BaseModel, Generic[T]):
    code: int
    message: str
    data: T

    class Config:
        from_attributes = True
        populate_by_name = True
