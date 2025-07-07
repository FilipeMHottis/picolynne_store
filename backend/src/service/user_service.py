from typing import List
from ..model.user_model import UserModel
from ..typings.response_typing import Response
from ..typings.user_typing import (
    User,
    UserCreate,
    UserLogin,
    TokenData,
)


class UserService:
    def __init__(self, db):
        self.user_model = UserModel(db)

    def get_all_users(self) -> Response[List[User]]:
        try:
            users = self.user_model.get_all_users()
            return Response(
                code=200,
                message="Users fetched successfully.",
                data=users or [],
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error fetching users: {str(e)}",
                data=None,
            )

    def get_user_by_id(self, user_id: int) -> Response[User]:
        try:
            user = self.user_model.get_user_by_id(user_id)
            return Response(
                code=200,
                message="User fetched successfully.",
                data=user,
            )
        except Exception as e:
            if str(e) == "User not found.":
                return Response(
                    code=404,
                    message="User not found.",
                    data=None,
                )

            return Response(
                code=500,
                message=f"Error fetching user by ID: {str(e)}",
                data=None,
            )

    def get_user_by_username(self, username: str) -> Response[User]:
        try:
            user = self.user_model.get_user_by_username(username)
            return Response(
                code=200,
                message="User fetched successfully.",
                data=user,
            )
        except Exception as e:
            if str(e) == "User not found.":
                return Response(
                    code=404,
                    message="User not found.",
                    data=None,
                )

            return Response(
                code=500,
                message=f"Error fetching user by username: {str(e)}",
                data=None,
            )

    def create_user(self, user: UserCreate) -> Response[User]:
        try:
            user = self.user_model.create_user(user)
            return Response(
                code=201,
                message="User created successfully.",
                data=user,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error creating user: {str(e)}",
                data=None,
            )

    def update_user(self, user_id: int, user: User) -> Response[User]:
        try:
            user = self.user_model.update_user(user_id, user)
            return Response(
                code=200,
                message="User updated successfully.",
                data=user,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error updating user: {str(e)}",
                data=None,
            )

    def delete_user(self, user_id: int) -> Response[None]:
        try:
            self.user_model.delete_user(user_id)
            return Response(
                code=200,
                message="User deleted successfully.",
                data=None,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error deleting user: {str(e)}",
                data=None,
            )

    def authenticate_user(self, user: UserLogin) -> Response[str]:
        try:
            token = self.user_model.authenticate_user(user)
            return Response(
                code=200,
                message="User authenticated successfully.",
                data=token,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error authenticating user: {str(e)}",
                data=None,
            )

    def decode_token(self, token: str) -> Response[TokenData]:
        try:
            user = self.user_model.decode_token(token)
            return Response(
                code=200,
                message="User fetched successfully.",
                data=user,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error fetching current user: {str(e)}",
                data=None,
            )
