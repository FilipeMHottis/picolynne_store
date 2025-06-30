from typing import List
from ..model.tag_model import TagModel
from ..typings.tag_typing import Tag
from ..typings.response_typing import Response


class TagService:
    def __init__(self, db):
        self.tag_model = TagModel(db)

    def get_all_tags(self) -> Response[List[Tag]]:
        """
        Retorna todas as tags do banco de dados.
        """
        try:
            tags = self.tag_model.get_all_tags()
            return Response(
                code=200,
                message="Tags fetched successfully.",
                data=tags or [],
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error fetching tags: {str(e)}",
                data=None,
            )

    def get_tag_by_id(self, tag_id: int) -> Response[Tag]:
        """
        Busca uma tag pelo seu ID.
        """
        try:
            tag = self.tag_model.get_tag_by_id(tag_id)
            if tag:
                return Response(
                    code=200,
                    message="Tag fetched successfully.",
                    data=tag,
                )
            return Response(code=404, message="Tag not found.", data=None)
        except Exception as e:
            if str(e) == "Tag not found.":
                return Response(
                    code=404,
                    message="Customer not found.",
                    data=None,
                )

            return Response(
                code=500,
                message=f"Error fetching tag by ID: {str(e)}",
                data=None,
            )

    def get_tag_by_name(self, tag_name: str) -> Response[Tag]:
        """
        Busca uma tag pelo nome.
        """
        try:
            tag = self.tag_model.get_tag_by_name(tag_name)
            if tag:
                return Response(
                    code=200,
                    message="Tag fetched successfully.",
                    data=tag,
                )
            return Response(code=404, message="Tag not found.", data=None)
        except Exception as e:
            if str(e) == "Tag not found.":
                return Response(
                    code=404,
                    message="Customer not found.",
                    data=None,
                )

            return Response(
                code=500,
                message=f"Error fetching tag by name: {str(e)}",
                data=None,
            )

    def create_tag(self, tag: Tag) -> Response[Tag]:
        """
        Cria uma nova tag no banco de dados.
        """
        try:
            created_tag = self.tag_model.create_tag(tag)
            return Response(
                code=201,
                message="Tag created successfully.",
                data=created_tag,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error creating tag: {str(e)}",
                data=None,
            )

    def update_tag(self, tag_id: int, tag_data: dict) -> Response[Tag]:
        """
        Atualiza uma tag existente no banco de dados.
        """
        try:
            updated_tag = self.tag_model.update_tag(tag_id, tag_data)
            if updated_tag:
                return Response(
                    code=200,
                    message="Tag updated successfully.",
                    data=updated_tag,
                )
            return Response(
                code=404,
                message="Tag not found for update.",
                data=None,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error updating tag: {str(e)}",
                data=None,
            )

    def delete_tag(self, tag_id: int) -> Response[Tag]:
        """
        Deleta uma tag do banco de dados.
        """
        try:
            deleted_tag = self.tag_model.delete_tag(tag_id)
            return Response(
                code=200,
                message="Tag deleted successfully.",
                data=deleted_tag,
            )
        except KeyError:
            return Response(
                code=404,
                message="Tag not found for deletion.",
                data=None,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error deleting tag: {str(e)}",
                data=None,
            )
