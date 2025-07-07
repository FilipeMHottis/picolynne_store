from sqlalchemy.orm import Mapped, mapped_column
from ..database.database import Base


class UserBase(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(
        unique=True,
        index=True,
        nullable=False,
    )
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[str] = mapped_column(nullable=False)
