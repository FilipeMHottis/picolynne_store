from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..schemas.customer import CustomerBase
from ..typings.customer_typing import Customer


class CustomerModel:
    def __init__(self, db: Session):
        self.db = db

    def get_all_customers(self) -> List[Customer]:
        """Obtém todos os clientes."""
        try:
            result = self.db.query(CustomerBase).all()
            return [Customer.model_validate(customer) for customer in result]
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_customer_by_id(self, customer_id: int) -> Optional[Customer]:
        """Obtém um cliente pelo seu ID."""
        try:
            result = (
                self.db.query(CustomerBase)
                .filter(
                    CustomerBase.id == customer_id,
                )
                .first()
            )
            if not result:
                raise Exception("Customer not found.")
            return Customer.model_validate(result)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_customer_by_name(self, customer_name: str) -> Optional[Customer]:
        """Obtém um cliente pelo seu nome."""
        try:
            result = (
                self.db.query(CustomerBase)
                .filter(
                    CustomerBase.name == customer_name,
                )
                .first()
            )
            if not result:
                raise Exception("Customer not found.")
            return Customer.model_validate(result)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def create_customer(self, customer: Customer) -> Customer:
        """Cria um novo cliente."""
        try:
            new_customer = CustomerBase(**customer.model_dump())
            self.db.add(new_customer)
            self.db.commit()
            self.db.refresh(new_customer)
            return Customer.model_validate(new_customer)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def update_customer(
        self,
        customer_id: int,
        customer: Customer,
    ) -> Customer:
        """Atualiza um cliente."""
        try:
            result = (
                self.db.query(CustomerBase)
                .filter(
                    CustomerBase.id == customer_id,
                )
                .first()
            )
            if not result:
                raise Exception("Customer not found.")

            result.name = customer.name
            result.email = customer.email
            result.phone_number = customer.phone_number

            self.db.commit()
            self.db.refresh(result)
            return Customer.model_validate(result)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def delete_customer(self, customer_id: int) -> None:
        """Deleta um cliente."""
        try:
            result = (
                self.db.query(CustomerBase)
                .filter(
                    CustomerBase.id == customer_id,
                )
                .first()
            )
            if not result:
                raise Exception("Customer not found.")
            self.db.delete(result)
            self.db.commit()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
