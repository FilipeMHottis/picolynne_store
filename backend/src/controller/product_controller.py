from fastapi import APIRouter, Depends
from ..service.product_service import ProductService
from ..typings.product_typing import ProductCreate
from ..utils.handle_response import handle_response
from ..utils.get_serverce import get_service

router = APIRouter()


@router.get("/products")
def get_all_products(
    product_service: ProductService = Depends(get_service(ProductService)),
):
    """Rota para pegar todos os produtos."""
    response = product_service.get_all_products()
    return handle_response(response)


@router.get("/products/{product_id}")
def get_product_by_id(
    product_id: int,
    product_service: ProductService = Depends(get_service(ProductService)),
):
    """Rota para pegar um produto pelo seu ID."""
    response = product_service.get_product_by_id(product_id)
    return handle_response(response)


@router.get("/products/name/{product_name}")
def search_products_by_name(
    product_name: str,
    product_service: ProductService = Depends(get_service(ProductService)),
):
    """Rota para buscar produtos pelo nome."""
    response = product_service.search_products_by_name(product_name)
    return handle_response(response)


@router.get("/products/category/{category_name}")
def search_products_by_category(
    category_name: str,
    product_service: ProductService = Depends(get_service(ProductService)),
):
    """Rota para buscar produtos por categoria."""
    response = product_service.search_products_by_category(category_name)
    return handle_response(response)


@router.get("/products/tags/{tag_name}")
def search_products_by_tag(
    tag_name: str,
    product_service: ProductService = Depends(get_service(ProductService)),
):
    """Rota para buscar produtos por tag."""
    response = product_service.search_products_by_tag(tag_name)
    return handle_response(response)


@router.post("/products")
def create_product(
    product: ProductCreate,
    product_service: ProductService = Depends(get_service(ProductService)),
):
    """Rota para criar um novo produto."""
    response = product_service.create_product(product)
    return handle_response(response)


@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    product_data: ProductCreate,
    product_service: ProductService = Depends(get_service(ProductService)),
):
    """Rota para atualizar um produto existente."""
    response = product_service.update_product(product_id, product_data)
    return handle_response(response)


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    product_service: ProductService = Depends(get_service(ProductService)),
):
    """Rota para deletar um produto."""
    response = product_service.delete_product(product_id)
    return handle_response(response)
