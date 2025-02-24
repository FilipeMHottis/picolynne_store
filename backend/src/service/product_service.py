from typing import List
from ..model.product_model import ProductModel
from ..typings.product_typing import Product, ProductCreate
from ..typings.response_typing import Response
from fastapi import HTTPException


class ProductService:
    def __init__(self, db):
        self.product_model = ProductModel(db)

    def get_all_products(self) -> Response[List[Product]]:
        """Retorna todos os produtos."""
        try:
            products = self.product_model.get_all_products()
            return Response(
                code=200,
                message="Products fetched successfully.",
                data=products or [],
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching products: {str(e)}",
            )

    def get_product_by_id(self, product_id: int) -> Response[Product]:
        """Busca um produto pelo ID."""
        product = self.product_model.get_product_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found.")
        return Response(
            code=200,
            message="Product fetched successfully.",
            data=product,
        )

    def search_products_by_name(
        self,
        product_name: str,
    ) -> Response[List[Product]]:
        """Busca produtos pelo nome."""
        try:
            products = self.product_model.search_products_by_name(product_name)
            return Response(
                code=200,
                message="Products fetched successfully.",
                data=products or [],
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching products by name: {str(e)}",
            )

    def search_products_by_category(
        self, category_name: str
    ) -> Response[List[Product]]:
        """Busca produtos por categoria."""
        try:
            products = self.product_model.search_products_by_category(
                category_name,
            )
            return Response(
                code=200,
                message="Products fetched successfully.",
                data=products or [],
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching products by category: {str(e)}",
            )

    def search_products_by_tag(self, tag_name: str) -> Response[List[Product]]:
        """Busca produtos por tag."""
        try:
            products = self.product_model.search_products_by_tag(tag_name)
            return Response(
                code=200,
                message="Products fetched successfully.",
                data=products or [],
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching products by tag: {str(e)}",
            )

    def create_product(self, product: ProductCreate) -> Response[Product]:
        """Cria um novo produto."""
        try:
            new_product = self.product_model.create_product(product)
            return Response(
                code=201,
                message="Product created successfully.",
                data=new_product,
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error creating product: {str(e)}"
            )

    def update_product(
        self, product_id: int, product: ProductCreate
    ) -> Response[Product]:
        """Atualiza um produto."""
        try:
            updated_product = self.product_model.update_product(
                product_id,
                product,
            )
            if not updated_product:
                raise HTTPException(
                    status_code=404,
                    detail="Product not found.",
                )
            return Response(
                code=200,
                message="Product updated successfully.",
                data=updated_product,
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error updating product: {str(e)}"
            )

    def delete_product(self, product_id: int) -> Response[Product]:
        """Deleta um produto."""
        try:
            deleted_product = self.product_model.delete_product(product_id)

            return Response(
                code=200,
                message="Product deleted successfully.",
                data=deleted_product,
            )
        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            if str(e) == "Product not found.":
                raise HTTPException(status_code=404, detail=str(e))

            raise HTTPException(
                status_code=500, detail=f"Error deleting product: {str(e)}"
            )
