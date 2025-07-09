from fastapi import APIRouter, Depends
from ..service.tag_service import TagService
from ..typings.tag_typing import Tag
from ..utils.handle_response import handle_response
from ..utils.get_serverce import get_service

router = APIRouter()


@router.get("/tags")
def get_all_tags(tag_service: TagService = Depends(get_service(TagService))):
    """Rota para pegar todas as tags."""
    response = tag_service.get_all_tags()
    return handle_response(response)


@router.get("/tags/{tag_id}")
def get_tag_by_id(
    tag_id: int,
    tag_service: TagService = Depends(get_service(TagService)),
):
    """Rota para pegar uma tag pelo seu ID."""
    response = tag_service.get_tag_by_id(tag_id)
    return handle_response(response)


@router.get("/tags/name/{tag_name}")
def get_tag_by_name(
    tag_name: str,
    tag_service: TagService = Depends(get_service(TagService)),
):
    """Rota para pegar uma tag pelo seu nome."""
    response = tag_service.get_tag_by_name(tag_name)
    return handle_response(response)


@router.post("/tags")
def create_tag(
    tag: Tag,
    tag_service: TagService = Depends(get_service(TagService))
):
    """Rota para criar uma nova tag."""
    response = tag_service.create_tag(tag)
    return handle_response(response)


@router.put("/tags/{tag_id}")
def update_tag(
    tag_id: int,
    tag_data: Tag,
    tag_service: TagService = Depends(get_service(TagService)),
):
    """Rota para atualizar uma tag existente."""
    response = tag_service.update_tag(tag_id, tag_data)
    return handle_response(response)


@router.delete("/tags/{tag_id}")
def delete_tag(
    tag_id: int,
    tag_service: TagService = Depends(get_service(TagService)),
):
    """Rota para deletar uma tag."""
    response = tag_service.delete_tag(tag_id)
    return handle_response(response)
