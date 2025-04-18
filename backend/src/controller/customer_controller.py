from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..service.customer_service import CustomerService
from ..typings.customer_typing import Customer
from ..config.dependencies import get_db

router = APIRouter()


def get_customer_service(db: Session = Depends(get_db)) -> CustomerService:
    """Cria uma instância única do CustomerService como dependência."""
    return CustomerService(db)


# Função utilitária para tratar as respostas
def handle_response(response):
    if response.code != 200 and response.code != 201:
        raise HTTPException(status_code=response.code, detail=response.message)
    return response


@router.get("/customers")
def get_all_customers(
    customer_service: CustomerService = Depends(get_customer_service),
):
    """Rota para pegar todas as customers."""
    response = customer_service.get_all_customers()
    return handle_response(response)


@router.get("/customers/{customer_id}")
def get_customer_by_id(
    customer_id: int,
    customer_service: CustomerService = Depends(get_customer_service),
):
    """Rota para pegar uma customer pelo seu ID."""
    response = customer_service.get_customer_by_id(customer_id)
    return handle_response(response)


@router.get("/customers/name/{customer_name}")
def get_customer_by_name(
    customer_name: str,
    customer_service: CustomerService = Depends(get_customer_service),
):
    """Rota para pegar uma customer pelo seu nome."""
    response = customer_service.get_customer_by_name(customer_name)
    return handle_response(response)


@router.post("/customers")
def create_customer(
    customer: Customer,
    customer_service: CustomerService = Depends(get_customer_service),
):
    """Rota para criar uma nova customer."""
    response = customer_service.create_customer(customer)
    return handle_response(response)


@router.put("/customers/{customer_id}")
def update_customer(
    customer_id: int,
    customer_data: Customer,
    customer_service: CustomerService = Depends(get_customer_service),
):
    """Rota para atualizar uma customer."""
    response = customer_service.update_customer(customer_id, customer_data)
    return handle_response(response)


@router.delete("/customers/{customer_id}")
def delete_customer(
    customer_id: int,
    customer_service: CustomerService = Depends(get_customer_service),
):
    """Rota para deletar uma customer."""
    response = customer_service.delete_customer(customer_id)
    return handle_response(response)
