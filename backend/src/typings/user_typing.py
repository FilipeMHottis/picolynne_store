from typing import Optional, TypedDict
from pydantic import BaseModel


class User(BaseModel):
    id: Optional[int] = None
    username: str
    password: str
    role: str


class UserCreate(BaseModel):
    username: str
    password: str
    role: str


class TokenData(TypedDict):
    username: str
    role: str
    exp: float


class UserLogin(BaseModel):
    username: str
    password: str
