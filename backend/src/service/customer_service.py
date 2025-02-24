from typing import List
from ..model.customer_model import CustomerModel
from ..typings.customer_typing import Customer
from ..typings.response_typing import Response


class CustomerService:
    def __init__(self, db):
        self.customer_model = CustomerModel(db)

    def get_all_customers(self) -> Response[List[Customer]]:
        """
        Retorna todos os clientes do banco de dados.
        """
        try:
            customers = self.customer_model.get_all_customers()
            return Response(
                code=200,
                message="Customers fetched successfully.",
                data=customers or [],
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error fetching customers: {str(e)}",
                data=None,
            )

    def get_customer_by_id(self, customer_id: int) -> Response[Customer]:
        """
        Busca um cliente pelo seu ID.
        """
        try:
            customer = self.customer_model.get_customer_by_id(customer_id)
            return Response(
                code=200,
                message="Customer fetched successfully.",
                data=customer,
            )
        except Exception as e:
            if str(e) == "Customer not found.":
                return Response(
                    code=404,
                    message="Customer not found.",
                    data=None,
                )

            return Response(
                code=500,
                message=f"Error fetching customer by ID: {str(e)}",
                data=None,
            )

    def get_customer_by_name(self, customer_name: str) -> Response[Customer]:
        """
        Busca um cliente pelo nome.
        """
        try:
            customer = self.customer_model.get_customer_by_name(customer_name)
            return Response(
                code=200,
                message="Customer fetched successfully.",
                data=customer,
            )
        except Exception as e:
            if str(e) == "Customer not found.":
                return Response(
                    code=404,
                    message="Customer not found.",
                    data=None,
                )

            return Response(
                code=500,
                message=f"Error fetching customer by name: {str(e)}",
                data=None,
            )

    def create_customer(self, customer: Customer) -> Response[Customer]:
        """
        Cria um novo cliente.
        """
        try:
            new_customer = self.customer_model.create_customer(customer)
            return Response(
                code=201,
                message="Customer created successfully.",
                data=new_customer,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error creating customer: {str(e)}",
                data=None,
            )

    def update_customer(
        self,
        customer_id: int,
        customer: Customer,
    ) -> Response[Customer]:
        """
        Atualiza um cliente.
        """
        try:
            updated_customer = self.customer_model.update_customer(
                customer_id, customer
            )
            return Response(
                code=200,
                message="Customer updated successfully.",
                data=updated_customer,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error updating customer: {str(e)}",
                data=None,
            )

    def delete_customer(self, customer_id: int) -> Response[Customer]:
        """
        Deleta um cliente.
        """
        try:
            self.customer_model.delete_customer(customer_id)

            return Response(
                code=200,
                message="Customer deleted successfully.",
                data=None,
            )
        except Exception as e:
            return Response(
                code=500,
                message=f"Error deleting customer: {str(e)}",
                data=None,
            )
