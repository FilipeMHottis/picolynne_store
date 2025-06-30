from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..schemas.sale import SaleBase
from ..schemas.sale_item import SaleItemBase
from ..typings.sale_typing import (
    Sale,
    SaleItem,
    CustomerSale,
    SaleCreate,
)
from .product_model import ProductModel
from .customer_model import CustomerModel


def product_return(
    db: Session,
    product_id: int,
    quantity: int,
    total_quantity_for_price: int,
    update_stock: bool = True,
) -> SaleItem:
    product = ProductModel(db).get_product_by_id(product_id)
    price = 0

    if product is None:
        raise Exception(f"Product {product_id} not found.")

    # Só checa o estoque se for para atualizar o estoque
    if update_stock and product.stock < quantity:
        raise Exception(f"Product {product_id} out of stock.")

    if update_stock:
        ProductModel(db).update_stock(
            product_id=product_id,
            quantity=-quantity,
        )

    if total_quantity_for_price >= 50:
        price = product.category.price_above_50_units
    elif total_quantity_for_price >= 20:
        price = product.category.price_above_20_units
    else:
        price = product.category.price

    return SaleItem(
        product_id=product.id,
        product_name=product.name,
        quantity=quantity,
        price=price,
    )


def customer_return(
    db: Session,
    customer_id: int,
) -> CustomerSale:
    customer = CustomerModel(db).get_customer_by_id(customer_id)

    if customer is None:
        raise Exception(f"Customer {customer_id} not found.")

    return CustomerSale(
        id=customer.id,
        name=customer.name,
    )


class SaleModel:
    def __init__(self, db: Session):
        self.db = db

    def get_all_sales(self) -> List[Sale]:
        try:
            result = self.db.query(SaleBase).all()
            returned_sales: List[Sale] = []

            for sale in result:
                customer = customer_return(self.db, sale.customer_id)
                items = (
                    self.db.query(SaleItemBase)
                    .filter(SaleItemBase.sale_id == sale.id)
                    .all()
                )

                items_dict = [item.__dict__.copy() for item in items]

                items_dict = [
                    product_return(
                        self.db,
                        item["product_id"],
                        item["quantity"],
                        sale.total_quantity,
                        update_stock=False,  # <- Aqui você já tentou evitar mexer no estoque
                    )
                    for item in items_dict
                ]

                sale_dict = sale.__dict__.copy()
                sale_dict["customer"] = customer
                sale_dict["items"] = items_dict
                returned_sales.append(Sale.model_validate(sale_dict))

            return returned_sales

        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_sale_by_id(self, sale_id: int) -> Optional[Sale]:
        """Obtém uma venda pelo seu ID."""
        try:
            result = (
                self.db.query(SaleBase)
                .filter(
                    SaleBase.id == sale_id,
                )
                .first()
            )
            if not result:
                raise Exception("Sale not found.")

            customer = customer_return(self.db, result.customer_id)

            items = (
                self.db.query(SaleItemBase)
                .filter(SaleItemBase.sale_id == result.id)
                .all()
            )

            items_dict = [item.__dict__.copy() for item in items]
            items_dict = [
                product_return(
                    self.db,
                    item["product_id"],
                    item["quantity"],
                    result.total_quantity,
                    update_stock=False,
                )
                for item in items_dict
            ]

            sale_dict = result.__dict__.copy()
            sale_dict["customer"] = customer
            sale_dict["items"] = items_dict

            return Sale.model_validate(sale_dict)

        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_sale_by_customer_id(self, customer_id: int) -> List[Sale]:
        """Obtém todas as vendas de um cliente."""
        try:
            result = (
                self.db.query(SaleBase)
                .filter(
                    SaleBase.customer_id == customer_id,
                )
                .all()
            )
            return [Sale.model_validate(sale) for sale in result]
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def create_sale(self, sale_data: SaleCreate) -> Sale:
        """Cria uma nova venda com itens."""
        try:
            customer = customer_return(self.db, sale_data.customer_id)
            total_quantity_for_price = 0
            total_price = 0
            items: List[SaleItem] = []

            if customer is None:
                raise Exception(f"Customer {sale_data.customer_id} not found.")

            for item in sale_data.items:
                total_quantity_for_price += item.quantity

            for item in sale_data.items:
                product = product_return(
                    self.db,
                    item.product_id,
                    item.quantity,
                    total_quantity_for_price,
                )

                if product is None:
                    raise Exception(f"Product {item.product_id} not found.")

                total_price += product.price * product.quantity
                items.append(product)

            new_sale = SaleBase(
                customer_id=sale_data.customer_id,
                total_quantity=total_quantity_for_price,
                total_price=total_price,
            )

            self.db.add(new_sale)
            self.db.commit()
            self.db.refresh(new_sale)

            for item in items:
                new_item = SaleItemBase(
                    sale_id=new_sale.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                )
                self.db.add(new_item)

            self.db.commit()
            self.db.refresh(new_sale)

            sale_dict = new_sale.__dict__.copy()
            sale_dict["customer"] = customer
            sale_dict["items"] = items

            return Sale.model_validate(sale_dict)

        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")

    def delete_sale(self, sale_id: int) -> None:
        """Deleta uma venda e seus itens associados."""
        try:
            result = (
                self.db.query(SaleBase)
                .filter(
                    SaleBase.id == sale_id,
                )
                .first()
            )
            if not result:
                raise Exception("Sale not found.")

            # Deletar os itens associados à venda
            items = (
                self.db.query(SaleItemBase)
                .filter(SaleItemBase.sale_id == sale_id)
                .all()
            )
            for item in items:
                self.db.delete(item)

            # Deletar a venda
            self.db.delete(result)
            self.db.commit()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")

    def preview_sale(self, sale_data: SaleCreate) -> Sale:
        """Retorna uma prévia da venda sem realizar nenhuma operação no db."""
        customer = customer_return(self.db, sale_data.customer_id)
        total_quantity_for_price = 0
        total_price = 0
        items: List[SaleItem] = []

        if customer is None:
            raise Exception(f"Customer {sale_data.customer_id} not found.")

        for item in sale_data.items:
            total_quantity_for_price += item.quantity

        for item in sale_data.items:
            product = product_return(
                self.db,
                item.product_id,
                item.quantity,
                total_quantity_for_price,
                update_stock=False,
            )

            if product is None:
                raise Exception(f"Product {item.product_id} not found.")

            total_price += product.price * product.quantity
            items.append(product)

        sale_preview = Sale(
            id=None,
            customer=customer,
            items=items,
            total_quantity=total_quantity_for_price,
            total_price=total_price,
        )

        return sale_preview
