from fastapi import APIRouter, Depends
from ..service.user_service import UserService
from ..typings.user_typing import User, UserCreate
from ..utils.handle_response import handle_response
from ..utils.get_serverce import get_service

router = APIRouter()


# Função utilitária para tratar as respostas

@router.get("/users")
def get_all_users(
    user_service: UserService = Depends(get_service(UserService)),
):
    """Rota para pegar todas as users."""
    response = user_service.get_all_users()
    return handle_response(response)


@router.get("/users/{user_id}")
def get_user_by_id(
    user_id: int,
    user_service: UserService = Depends(get_service(UserService)),
):
    """Rota para pegar uma user pelo seu ID."""
    response = user_service.get_user_by_id(user_id)
    return handle_response(response)


@router.get("/users/username/{username}")
def get_user_by_username(
    username: str,
    user_service: UserService = Depends(get_service(UserService)),
):
    """Rota para pegar uma user pelo seu nome de usuário."""
    response = user_service.get_user_by_username(username)
    return handle_response(response)


@router.post("/users")
def create_user(
    user: UserCreate,
    user_service: UserService = Depends(get_service(UserService)),
):
    """Rota para criar uma nova user."""
    response = user_service.create_user(user)
    return handle_response(response)


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    user: User,
    user_service: UserService = Depends(get_service(UserService)),
):
    """Rota para atualizar uma user."""
    response = user_service.update_user(user_id, user)
    return handle_response(response)


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    user_service: UserService = Depends(get_service(UserService)),
):
    """Rota para deletar uma user."""
    response = user_service.delete_user(user_id)
    return handle_response(response)
