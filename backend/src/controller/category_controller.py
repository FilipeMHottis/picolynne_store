from fastapi import APIRouter, Depends
from ..service.category_service import CategoryService
from ..typings.category_typing import Category
from ..utils.handle_response import handle_response
from ..utils.get_serverce import get_service

router = APIRouter()


@router.get("/categories")
def get_all_categories(
    category_service: CategoryService = Depends(get_service(CategoryService)),
):
    """Rota para pegar todas as categorias."""
    response = category_service.get_all_categories()
    return handle_response(response)


@router.get("/categories/{category_id}")
def get_category_by_id(
    category_id: int,
    category_service: CategoryService = Depends(get_service(CategoryService)),
):
    """Rota para pegar uma categoria pelo seu ID."""
    response = category_service.get_category_by_id(category_id)
    return handle_response(response)


@router.get("/categories/name/{category_name}")
def get_category_by_name(
    category_name: str,
    category_service: CategoryService = Depends(get_service(CategoryService)),
):
    """Rota para pegar uma categoria pelo seu nome."""
    response = category_service.get_category_by_name(category_name)
    return handle_response(response)


@router.get("/categories/search/{category_name}")
def search_categories(
    category_name: str,
    category_service: CategoryService = Depends(get_service(CategoryService)),
):
    """Rota para buscar categorias pelo nome."""
    response = category_service.search_category(category_name)
    return handle_response(response)


@router.post("/categories")
def create_category(
    category: Category,
    category_service: CategoryService = Depends(get_service(CategoryService)),
):
    """Rota para criar uma nova categoria."""
    response = category_service.create_category(category)
    return handle_response(response)


@router.put("/categories/{category_id}")
def update_category(
    category_id: int,
    category_data: Category,
    category_service: CategoryService = Depends(get_service(CategoryService)),
):
    """Rota para atualizar uma categoria existente."""
    response = category_service.update_category(category_id, category_data)
    return handle_response(response)


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    category_service: CategoryService = Depends(get_service(CategoryService)),
):
    """Rota para deletar uma categoria existente."""
    response = category_service.delete_category(category_id)
    return handle_response(response)
