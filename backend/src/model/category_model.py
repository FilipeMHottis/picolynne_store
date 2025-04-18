from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..schemas.category import CategoryBase
from ..typings.category_typing import Category


class CategoryModel:
    def __init__(self, db: Session):
        self.db = db

    def get_all_categories(self) -> List[Category]:
        """Obtém todas as categorias."""
        try:
            result = self.db.query(CategoryBase).all()
            return [Category.model_validate(category) for category in result]
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_category_by_id(self, category_id: int) -> Optional[Category]:
        """Obtém uma categoria pelo seu ID."""
        try:
            result = (
                self.db.query(CategoryBase)
                .filter(CategoryBase.id == category_id)
                .first()
            )
            if not result:
                raise Exception("Category not found.")
            return Category.model_validate(result)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_category_by_name(self, category_name: str) -> Optional[Category]:
        """Obtém uma categoria pelo seu nome."""
        try:
            result = (
                self.db.query(CategoryBase)
                .filter(CategoryBase.name == category_name)
                .first()
            )
            if not result:
                raise Exception("Category not found.")
            return Category.model_validate(result)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def create_category(self, category: Category) -> Category:
        """Cria uma nova categoria."""
        try:
            new_category = CategoryBase(**category.model_dump())
            self.db.add(new_category)
            self.db.commit()
            self.db.refresh(new_category)
            return Category.model_validate(new_category)
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")

    def update_category(
        self,
        category_id: int,
        category: Category,
    ) -> Category:
        """Atualiza uma categoria existente."""
        try:
            category_to_update = (
                self.db.query(CategoryBase)
                .filter(CategoryBase.id == category_id)
                .first()
            )

            if not category_to_update:
                raise Exception("Category not found.")

            category_data = category.model_dump()
            category_data["id"] = category_id

            for key, value in category_data.items():
                setattr(category_to_update, key, value)

            self.db.commit()
            self.db.refresh(category_to_update)
            return Category.model_validate(category_to_update)
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")

    def delete_category(self, category_id: int) -> None:
        """Deleta uma categoria."""
        try:
            category_to_delete = (
                self.db.query(CategoryBase)
                .filter(CategoryBase.id == category_id)
                .first()
            )
            if not category_to_delete:
                raise Exception("Category not found.")

            self.db.delete(category_to_delete)
            self.db.commit()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")

    def search_category(self, category_name: str) -> List[Category]:
        """Busca categorias pelo nome."""
        try:
            result = (
                self.db.query(CategoryBase)
                .filter(CategoryBase.name.ilike(f"%{category_name}%"))
                .all()
            )

            if not result:
                return []

            return [Category.model_validate(category) for category in result]
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
