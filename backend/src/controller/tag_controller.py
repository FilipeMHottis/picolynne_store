from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..service.tag_service import TagService
from ..typings.tag_typing import Tag
from ..config.dependencies import get_db

router = APIRouter()


def get_tag_service(db: Session = Depends(get_db)) -> TagService:
    """Cria uma instância única do TagService como dependência."""
    return TagService(db)


# Função utilitária para tratar as respostas
def handle_response(response):
    if response.code != 200 and response.code != 201:
        raise HTTPException(status_code=response.code, detail=response.message)
    return response


@router.get("/tags")
def get_all_tags(tag_service: TagService = Depends(get_tag_service)):
    """Rota para pegar todas as tags."""
    response = tag_service.get_all_tags()
    return handle_response(response)


@router.get("/tags/{tag_id}")
def get_tag_by_id(
    tag_id: int,
    tag_service: TagService = Depends(get_tag_service),
):
    """Rota para pegar uma tag pelo seu ID."""
    response = tag_service.get_tag_by_id(tag_id)
    return handle_response(response)


@router.get("/tags/name/{tag_name}")
def get_tag_by_name(
    tag_name: str,
    tag_service: TagService = Depends(get_tag_service),
):
    """Rota para pegar uma tag pelo seu nome."""
    response = tag_service.get_tag_by_name(tag_name)
    return handle_response(response)


@router.post("/tags")
def create_tag(tag: Tag, tag_service: TagService = Depends(get_tag_service)):
    """Rota para criar uma nova tag."""
    response = tag_service.create_tag(tag)
    return handle_response(response)


@router.put("/tags/{tag_id}")
def update_tag(
    tag_id: int,
    tag_data: Tag,
    tag_service: TagService = Depends(get_tag_service),
):
    """Rota para atualizar uma tag existente."""
    response = tag_service.update_tag(tag_id, tag_data)
    return handle_response(response)


@router.delete("/tags/{tag_id}")
def delete_tag(
    tag_id: int,
    tag_service: TagService = Depends(get_tag_service),
):
    """Rota para deletar uma tag."""
    response = tag_service.delete_tag(tag_id)
    return handle_response(response)
