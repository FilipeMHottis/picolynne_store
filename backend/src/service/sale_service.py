from typing import List
from sqlalchemy.orm import Session
from ..model.sale_model import SaleModel
from ..typings.response_typing import Response
from ..typings.sale_typing import Sale, SaleCreate
from fastapi import HTTPException


class SaleService:
    def __init__(self, db: Session):
        self.sale_model = SaleModel(db)

    def get_all_sales(self) -> Response[List[Sale]]:
        """Retorna todas as vendas."""
        try:
            sales = self.sale_model.get_all_sales()
            return Response(
                code=200,
                message="Sales fetched successfully.",
                data=sales or [],
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching sales: {str(e)}",
            )

    def get_sale_by_id(self, sale_id: int) -> Response[Sale]:
        """Busca uma venda pelo ID."""
        try:
            sale = self.sale_model.get_sale_by_id(sale_id)
            return Response(
                code=200,
                message="Sale fetched successfully.",
                data=sale,
            )
        except Exception as e:
            if str(e) == "Sale not found.":
                raise HTTPException(
                    status_code=404,
                    detail="Sale not found.",
                )

            raise HTTPException(
                status_code=500,
                detail=f"Error fetching sale by ID: {str(e)}",
            )

    def get_sale_by_customer_id(
        self,
        customer_id: int,
    ) -> Response[List[Sale]]:
        """Busca todas as vendas de um cliente."""
        try:
            sales = self.sale_model.get_sale_by_customer_id(customer_id)
            return Response(
                code=200,
                message="Sales fetched successfully.",
                data=sales or [],
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching sales by customer ID: {str(e)}",
            )

    def create_sale(self, sale_data: SaleCreate) -> Response[Sale]:
        """Cria uma nova venda."""
        try:
            new_sale = self.sale_model.create_sale(sale_data)
            return Response(
                code=201,
                message="Sale created successfully.",
                data=new_sale,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error creating sale: {str(e)}",
                data=None,
            )

    def delete_sale(self, sale_id: int) -> Response[None]:
        try:
            self.sale_model.delete_sale(sale_id)
            return Response(
                code=200,
                message="Sale deleted successfully.",
                data=None,
            )
        except Exception as e:
            if str(e) == "Sale not found.":
                raise HTTPException(
                    status_code=404,
                    detail="Sale not found.",
                )
            raise HTTPException(
                status_code=500,
                detail=f"Error deleting sale: {str(e)}",
            )

    def preview_sale(self, sale_data: SaleCreate) -> Response[Sale]:
        try:
            preview = self.sale_model.preview_sale(sale_data)
            return Response(
                code=200,
                message="Sale preview fetched successfully.",
                data=preview,
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error previewing sale: {str(e)}",
            )
