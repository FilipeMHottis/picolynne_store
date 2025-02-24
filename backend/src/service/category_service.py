from typing import List
from ..model.category_model import CategoryModel
from ..typings.category_typing import Category
from ..typings.response_typing import Response


class CategoryService:
    def __init__(self, db):
        self.category_model = CategoryModel(db)

    def get_all_categories(self) -> Response[List[Category]]:
        """
        Retorna todas as categorias do banco de dados.
        """
        try:
            categories = self.category_model.get_all_categories()
            return Response(
                code=200,
                message="Categories fetched successfully.",
                data=categories or [],
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error fetching categories: {str(e)}",
                data=None,
            )

    def get_category_by_id(self, category_id: int) -> Response[Category]:
        """
        Busca uma categoria pelo seu ID.
        """
        try:
            category = self.category_model.get_category_by_id(category_id)
            if category:
                return Response(
                    code=200,
                    message="Category fetched successfully.",
                    data=category,
                )
            return Response(code=404, message="Category not found.", data=None)
        except Exception as e:
            if str(e) == "Category not found.":
                return Response(
                    code=404,
                    message="Customer not found.",
                    data=None,
                )

            return Response(
                code=500,
                message=f"Error fetching category by ID: {str(e)}",
                data=None,
            )

    def get_category_by_name(self, category_name: str) -> Response[Category]:
        """
        Busca uma categoria pelo nome.
        """
        try:
            category = self.category_model.get_category_by_name(category_name)
            if category:
                return Response(
                    code=200,
                    message="Category fetched successfully.",
                    data=category,
                )
            return Response(code=404, message="Category not found.", data=None)
        except Exception as e:
            if str(e) == "Category not found.":
                return Response(
                    code=404,
                    message="Customer not found.",
                    data=None,
                )

            return Response(
                code=500,
                message=f"Error fetching category by name: {str(e)}",
                data=None,
            )

    def create_category(self, category: Category) -> Response[Category]:
        """
        Cria uma nova categoria.
        """
        try:
            new_category = self.category_model.create_category(category)
            return Response(
                code=201,
                message="Category created successfully.",
                data=new_category,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error creating category: {str(e)}",
                data=None,
            )

    def update_category(
        self,
        category_id: int,
        category: Category,
    ) -> Response[Category]:
        """
        Atualiza uma categoria.
        """
        try:
            updated_category = self.category_model.update_category(
                category_id, category
            )
            return Response(
                code=200,
                message="Category updated successfully.",
                data=updated_category,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error updating category: {str(e)}",
                data=None,
            )

    def delete_category(self, category_id: int) -> Response[Category]:
        """
        Deleta uma categoria.
        """
        try:
            deleted_category = self.category_model.delete_category(category_id)
            return Response(
                code=200,
                message="Category deleted successfully.",
                data=deleted_category,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error deleting category: {str(e)}",
                data=None,
            )

    def search_category(self, category_name: str) -> Response[List[Category]]:
        """
        Busca categorias pelo nome.
        """
        try:
            categories = self.category_model.search_category(category_name)
            if categories:
                return Response(
                    code=200,
                    message="Categories fetched successfully.",
                    data=categories,
                )
            return Response(
                code=404,
                message="No categories found.",
                data=None,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error searching category: {str(e)}",
                data=None,
            )
