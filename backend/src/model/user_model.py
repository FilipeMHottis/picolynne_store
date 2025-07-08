from datetime import datetime, timedelta, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..schemas.user import UserBase
from ..typings.user_typing import (
    User,
    UserCreate,
    TokenData,
    UserLogin,
)
from ..utils.auth_utils import (
    hash_password,
    create_access_token,
    verify_password,
    decode_token,
)


def user_for_token(user: User) -> TokenData:
    return TokenData(
        username=user.username,
        role=user.role,
        exp=int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp()),
    )


class UserModel:
    def __init__(self, db: Session):
        self.db = db

    def get_all_users(self) -> List[User]:
        """Obtém todos os usuários."""
        try:
            result = self.db.query(UserBase).all()
            return [User.model_validate(user.__dict__) for user in result]
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Obtém um usuário pelo seu ID."""
        try:
            result = (
                self.db.query(UserBase)
                .filter(
                    UserBase.id == user_id,
                )
                .first()
            )
            if not result:
                raise Exception("User not found.")
            return User.model_validate(result.__dict__)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Obtém um usuário pelo seu nome de usuário."""
        try:
            result = (
                self.db.query(UserBase)
                .filter(
                    UserBase.username == username,
                )
                .first()
            )
            if not result:
                raise Exception("User not found.")
            return User.model_validate(result.__dict__)
        except Exception as e:
            # Se é uma exceção de "User not found", repassar
            if "User not found" in str(e):
                raise e
            # Para qualquer outro erro de banco, tratar como erro de database
            raise Exception(f"Database error: {str(e)}")

    def create_user(self, user: UserCreate) -> User:
        """Cria um usuário."""
        try:
            db_user = UserBase(
                username=user.username,
                password=hash_password(user.password),
                role=user.role,
            )
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            return User.model_validate(db_user.__dict__)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def update_user(self, user_id: int, user: UserCreate) -> User:
        """Atualiza um usuário."""
        try:
            db_user = (
                self.db.query(UserBase)
                .filter(
                    UserBase.id == user_id,
                )
                .first()
            )
            if not db_user:
                raise Exception("User not found.")
            db_user.username = user.username
            db_user.password = hash_password(user.password)
            db_user.role = user.role
            self.db.commit()
            self.db.refresh(db_user)
            return User.model_validate(db_user.__dict__)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def delete_user(self, user_id: int) -> None:
        """Deleta um usuário."""
        try:
            result = (
                self.db.query(UserBase)
                .filter(
                    UserBase.id == user_id,
                )
                .first()
            )
            if not result:
                raise Exception("User not found.")
            self.db.delete(result)
            self.db.commit()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def authenticate_user(self, user: UserLogin) -> str:
        """Autentica um usuário."""
        try:
            db_user = self.get_user_by_username(user.username)

            # Se o usuário não for encontrado ou a senha estiver incorreta,
            if not db_user:
                raise Exception("User or password is incorrect")
            # se a senha não corresponder, também lançar uma exceção
            if not verify_password(user.password, db_user.password):
                raise Exception("User or password is incorrect")

            return create_access_token(
                user_for_token(db_user),
            )
        except Exception as e:
            raise Exception(f"Authentication error: {str(e)}")

    def decode_token(self, token: str) -> TokenData:
        """Obtém o usuário atual."""
        try:
            token_data = decode_token(token)
            return token_data
        except Exception as e:
            raise Exception(f"Error getting current user: {str(e)}")
