from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..schemas.tag import TagBase
from ..typings.tag_typing import Tag


class TagModel:
    def __init__(self, db: Session):
        self.db = db

    def get_all_tags(self) -> List[Tag]:
        """Obtém todas as tags."""
        try:
            result = self.db.query(TagBase).all()
            return [Tag.model_validate(tag) for tag in result]
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_tag_by_id(self, tag_id: int) -> Optional[Tag]:
        """Obtém uma tag pelo seu ID."""
        try:
            result = (
                self.db.query(TagBase)
                .filter(
                    TagBase.id == tag_id,
                )
                .first()
            )
            if not result:
                raise Exception("Tag not found.")
            return Tag.model_validate(result)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def get_tag_by_name(self, tag_name: str) -> Optional[Tag]:
        """Obtém uma tag pelo seu nome."""
        try:
            result = (
                self.db.query(TagBase)
                .filter(
                    TagBase.name == tag_name,
                )
                .first()
            )
            if not result:
                raise Exception("Tag not found.")
            return Tag.model_validate(result)
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")

    def create_tag(self, tag: Tag) -> Tag:
        """Cria uma nova tag."""
        try:
            new_tag = TagBase(**tag.model_dump())
            self.db.add(new_tag)
            self.db.commit()
            self.db.refresh(new_tag)
            return Tag.model_validate(new_tag)
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")

    def update_tag(self, tag_id: int, tag: Tag) -> Tag:
        """Atualiza uma tag existente."""
        try:
            tag_to_update = (
                self.db.query(TagBase)
                .filter(
                    TagBase.id == tag_id,
                )
                .first()
            )

            if not tag_to_update:
                raise Exception("Tag not found.")

            tag_data = tag.model_dump()
            tag_data["id"] = tag_id

            for key, value in tag_data.items():
                setattr(tag_to_update, key, value)

            self.db.commit()
            self.db.refresh(tag_to_update)
            return Tag.model_validate(tag_to_update)
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")

    def delete_tag(self, tag_id: int) -> None:
        """Deleta uma tag."""
        try:
            tag_to_delete = (
                self.db.query(TagBase)
                .filter(
                    TagBase.id == tag_id,
                )
                .first()
            )
            if not tag_to_delete:
                raise Exception("Tag not found.")

            self.db.delete(tag_to_delete)
            self.db.commit()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise Exception(f"Database error: {str(e)}")
