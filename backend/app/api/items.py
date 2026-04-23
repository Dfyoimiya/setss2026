from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.response import ok
from app.core.exceptions import (
    ItemNotFoundException,
    ItemAlreadyExistsException,
    ValidationException,
)
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate, ItemResponse

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/")
def list_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    return ok(data=[ItemResponse.model_validate(i).model_dump(mode="json") for i in items])


@router.post("/", status_code=201)
def create_item(payload: ItemCreate, db: Session = Depends(get_db)):
    # Optional: guard against duplicates if a unique constraint exists
    existing = db.query(Item).filter(Item.name == payload.name).first()
    if existing:
        raise ItemAlreadyExistsException(
            message=f"Item with name '{payload.name}' already exists"
        ).to_http()

    item = Item(name=payload.name, description=payload.description)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ok(data=ItemResponse.model_validate(item).model_dump(mode="json"),
              message="Item created successfully")


@router.get("/{item_id}")
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise ItemNotFoundException(
            message=f"Item with id={item_id} not found"
        ).to_http()
    return ok(data=ItemResponse.model_validate(item).model_dump(mode="json"))


@router.put("/{item_id}")
def update_item(item_id: int, payload: ItemUpdate, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise ItemNotFoundException(
            message=f"Item with id={item_id} not found"
        ).to_http()

    if payload.name is not None:
        # basic business validation example
        if len(payload.name.strip()) == 0:
            raise ValidationException(message="Item name cannot be empty").to_http()
        item.name = payload.name
    if payload.description is not None:
        item.description = payload.description

    db.commit()
    db.refresh(item)
    return ok(data=ItemResponse.model_validate(item).model_dump(mode="json"),
              message="Item updated successfully")


@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise ItemNotFoundException(
            message=f"Item with id={item_id} not found"
        ).to_http()

    db.delete(item)
    db.commit()
    return ok(message="Item deleted successfully")
