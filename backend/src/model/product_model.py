from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from .category_model import CategoryModel
from .tag_model import TagModel
from ..schemas.product import ProductBase
from ..schemas.tag import TagBase
from ..schemas.product_tag import ProductTagAssociation
from ..typings.product_typing import Product, ProductCreate
from ..typings.category_typing import Category
from ..typings.tag_typing import Tag
from sqlalchemy.orm import joinedload


def return_category_and_tags(
    db,
    category_id: int,
    tags_id: List[int],
):
    """Retorna a categoria e tags completas, com validação adequada."""
    category = CategoryModel(db).get_category_by_id(category_id)
    tags = []

    if not category:
        raise Exception(f"Product with category id {category_id} not found")

    if tags_id:
        for tag_id in tags_id:
            tag = TagModel(db).get_tag_by_id(tag_id)

            if not tag:
                raise Exception(f"Product with tag id {tag_id} not found")

            tags.append(tag)

    return category, tags


class ProductModel:
    def __init__(self, db: Session):
        self.db = db

    def get_all_products(self) -> List[Product]:
        """Retorna todos os produtos."""
        try:
            result = self.db.query(ProductBase).all()

            # Cada produto, busca informações completas da categoria e tags
            products = []
            for product in result:
                category, tags = return_category_and_tags(
                    self.db,
                    product.category_id,
                    [tag.id for tag in product.tags],
                )

                # Criando um objeto Product com categoria e tags completas
                product_data = Product.model_validate(product)
                product_data.category = (
                    Category.model_validate(category) if category else None
                )
                product_data.tags = [Tag.model_validate(tag) for tag in tags]

                products.append(product_data)

            return products

        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_product_by_id(self, product_id: int) -> Optional[Product]:
        """Retorna um produto pelo ID com categoria e tags completas."""
        try:
            product = (
                self.db.query(ProductBase)
                .filter(
                    ProductBase.id == product_id,
                )
                .first()
            )
            if not product:
                return None  # Retorna None se o produto não for encontrado

            category, tags = return_category_and_tags(
                self.db,
                product.category_id,
                [tag.id for tag in product.tags],
            )

            # Preenchendo o retorno com categoria e tags completas
            product_data = Product.model_validate(product)
            product_data.category = (
                Category.model_validate(category) if category else None
            )
            product_data.tags = [Tag.model_validate(tag) for tag in tags]

            return product_data

        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def search_products_by_name(self, product_name: str) -> List[Product]:
        """Busca produtos pelo nome com categoria e tags completas."""
        try:
            result = (
                self.db.query(ProductBase)
                .filter(ProductBase.name.ilike(f"%{product_name}%"))
                .all()
            )

            products = []
            for product in result:
                category, tags = return_category_and_tags(
                    self.db,
                    product.category_id,
                    [tag.id for tag in product.tags],
                )

                product_data = Product.model_validate(product)
                product_data.category = (
                    Category.model_validate(category) if category else None
                )
                product_data.tags = [Tag.model_validate(tag) for tag in tags]

                products.append(product_data)

            return products

        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def search_products_by_category(self, category_name: str) -> List[Product]:
        """Busca produtos por categoria."""
        try:
            result = (
                self.db.query(ProductBase)
                .filter(ProductBase.category.has(name=category_name))
                .all()
            )

            products = []
            for product in result:
                category, tags = return_category_and_tags(
                    self.db,
                    product.category_id,
                    [tag.id for tag in product.tags],
                )

                product_data = Product.model_validate(product)
                product_data.category = category
                product_data.tags = tags

                products.append(product_data)

            return products

        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def search_products_by_tag(self, tag_name: str) -> List[Product]:
        """Busca produtos por tag."""
        try:
            result = (
                self.db.query(ProductBase)
                .filter(ProductBase.tags.any(TagBase.name == tag_name))
                .all()
            )

            products = []
            for product in result:
                category, tags = return_category_and_tags(
                    self.db,
                    product.category_id,
                    [tag.id for tag in product.tags],
                )

                # Criando um objeto Product com categoria e tags completas
                product_data = Product.model_validate(product)
                product_data.category = (
                    Category.model_validate(category) if category else None
                )
                product_data.tags = [Tag.model_validate(tag) for tag in tags]

                products.append(product_data)

            return products

        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def create_product(self, product: ProductCreate) -> Product:
        """Cria um novo produto com categoria e tags completas."""
        try:
            category, tags = return_category_and_tags(
                self.db,
                product.category_id,
                product.tags_id,
            )

            if not category:
                raise Exception("Category not found.")

            new_product = ProductBase(
                name=product.name,
                description=product.description,
                category_id=category.id,
            )

            self.db.add(new_product)
            self.db.commit()
            self.db.refresh(new_product)

            # Adicionar associações de tags ao produto
            for tag in tags:
                association = ProductTagAssociation.insert().values(
                    product_id=new_product.id, tag_id=tag.id
                )
                self.db.execute(association)

            self.db.commit()
            self.db.refresh(new_product)

            # Criar o objeto Product com os dados completos
            product_data = Product.model_validate(new_product)
            product_data.category = Category.model_validate(category)
            product_data.tags = [Tag.model_validate(tag) for tag in tags]

            return product_data

        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")

    def update_product(
        self, product_id: int, product_data: ProductCreate
    ) -> Product:
        """Atualiza um produto existente com categoria e tags completas."""
        try:
            product_to_update = (
                self.db.query(ProductBase)
                .filter(
                    ProductBase.id == product_id,
                )
                .first()
            )
            if not product_to_update:
                raise Exception("Product not found.")

            category, tags = return_category_and_tags(
                self.db,
                product_data.category_id,
                product_data.tags_id,
            )

            if not category:
                raise Exception("Category not found.")

            product_to_update.name = product_data.name
            product_to_update.description = product_data.description
            product_to_update.category_id = category.id

            self.db.execute(
                ProductTagAssociation.delete().where(
                    ProductTagAssociation.c.product_id == product_to_update.id
                )
            )
            for tag in tags:
                association = ProductTagAssociation.insert().values(
                    product_id=product_to_update.id, tag_id=tag.id
                )
                self.db.execute(association)

            self.db.commit()
            self.db.refresh(product_to_update)

            product_data = Product.model_validate(product_to_update)
            product_data.category = Category.model_validate(category)
            product_data.tags = [Tag.model_validate(tag) for tag in tags]

            return product_data

        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")

    def delete_product(self, product_id: int) -> None:
        """Deleta um produto e suas associações de tags."""
        try:
            # Carregar o produto com seus relacionamentos
            product = (
                self.db.query(ProductBase)
                .options(
                    joinedload(ProductBase.category),
                    joinedload(
                        ProductBase.tags,
                    ),
                )
                .filter(ProductBase.id == product_id)
                .one_or_none()
            )

            if not product:
                raise Exception("Product not found.")

            # Deletar o produto
            self.db.delete(product)
            self.db.commit()

        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")
