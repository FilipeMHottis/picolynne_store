from fastapi import APIRouter, Depends
from ..service.user_service import UserService
from ..typings.user_typing import UserLogin
from .user_controller import get_user_service
from ..utils.handle_response import handle_response

router = APIRouter()


@router.post("/login")
def login(
    user: UserLogin,
    user_service: UserService = Depends(get_user_service),
):
    """Rota para fazer login."""
    response = user_service.authenticate_user(user)
    return handle_response(response)
