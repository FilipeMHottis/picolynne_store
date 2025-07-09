from fastapi import APIRouter, Depends
from ..service.sale_service import SaleService
from ..typings.sale_typing import SaleCreate
from ..utils.handle_response import handle_response
from ..utils.get_serverce import get_service

router = APIRouter()


@router.get("/sales")
def get_all_sales(
    sale_service: SaleService = Depends(get_service(SaleService)),
):
    """Rota para pegar todas as vendas."""
    response = sale_service.get_all_sales()
    return handle_response(response)


@router.get("/sales/{sale_id}")
def get_sale_by_id(
    sale_id: int,
    sale_service: SaleService = Depends(get_service(SaleService)),
):
    """Rota para pegar uma venda pelo seu ID."""
    response = sale_service.get_sale_by_id(sale_id)
    return handle_response(response)


@router.get("/sales/customer/{customer_id}")
def search_sales_by_customer(
    customer_id: int,
    sale_service: SaleService = Depends(get_service(SaleService)),
):
    """Rota para buscar vendas por cliente."""
    response = sale_service.get_sale_by_customer_id(customer_id)
    return handle_response(response)


@router.post("/sales")
def create_sale(
    sale: SaleCreate,
    sale_service: SaleService = Depends(get_service(SaleService)),
):
    """Rota para criar uma nova venda."""
    response = sale_service.create_sale(sale)
    return handle_response(response)


@router.delete("/sales/{sale_id}")
def delete_sale(
    sale_id: int,
    sale_service: SaleService = Depends(get_service(SaleService)),
):
    """Rota para deletar uma venda."""
    response = sale_service.delete_sale(sale_id)
    return handle_response(response)


@router.post("/sales/preview")
def preview_sale(
    sale: SaleCreate,
    sale_service: SaleService = Depends(get_service(SaleService)),
):
    """Rota para visualizar uma venda antes de criá-la."""
    response = sale_service.preview_sale(sale)
    return handle_response(response)
