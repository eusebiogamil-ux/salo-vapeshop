from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.purchase import Purchase
from ..models.product import Product

router = APIRouter(prefix="/api/purchases", tags=["purchases"])


class PurchaseCreate(BaseModel):
    product_id: int | None = None
    quantity: int
    unit_cost: Decimal
    shipping_fee: Decimal = Decimal("0")
    notes: str | None = None


class PurchaseUpdate(BaseModel):
    quantity: int
    unit_cost: Decimal
    shipping_fee: Decimal = Decimal("0")
    notes: str | None = None


@router.get("")
def list_purchases(db: Session = Depends(get_db)):
    purchases = db.query(Purchase).order_by(Purchase.purchased_at.desc()).limit(100).all()
    result = []
    for p in purchases:
        result.append({
            "id": p.id,
            "product_id": p.product_id,
            "product_name": p.product.name if p.product else None,
            "product_brand": p.product.brand if p.product else None,
            "quantity": p.quantity,
            "unit_cost": float(p.unit_cost),
            "shipping_fee": float(p.shipping_fee),
            "total_cost": float(p.total_cost),
            "notes": p.notes,
            "purchased_at": p.purchased_at.isoformat(),
        })
    return result


@router.post("", status_code=201)
def create_purchase(data: PurchaseCreate, db: Session = Depends(get_db)):
    shipping = data.shipping_fee or Decimal("0")
    total = data.quantity * data.unit_cost + shipping

    if data.product_id:
        product = db.query(Product).filter(Product.id == data.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        product.stock_quantity += data.quantity

    purchase = Purchase(
        product_id=data.product_id,
        quantity=data.quantity,
        unit_cost=data.unit_cost,
        shipping_fee=shipping,
        total_cost=total,
        notes=data.notes,
    )
    db.add(purchase)
    db.commit()
    db.refresh(purchase)

    return {
        "id": purchase.id,
        "product_id": purchase.product_id,
        "quantity": purchase.quantity,
        "unit_cost": float(purchase.unit_cost),
        "shipping_fee": float(purchase.shipping_fee),
        "total_cost": float(purchase.total_cost),
        "notes": purchase.notes,
        "purchased_at": purchase.purchased_at.isoformat(),
    }


@router.patch("/{purchase_id}")
def update_purchase(purchase_id: int, data: PurchaseUpdate, db: Session = Depends(get_db)):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    qty_diff = data.quantity - purchase.quantity
    if purchase.product_id and qty_diff != 0:
        product = db.query(Product).filter(Product.id == purchase.product_id).first()
        if product:
            product.stock_quantity = max(0, product.stock_quantity + qty_diff)

    shipping = data.shipping_fee or Decimal("0")
    purchase.quantity = data.quantity
    purchase.unit_cost = data.unit_cost
    purchase.shipping_fee = shipping
    purchase.total_cost = data.quantity * data.unit_cost + shipping
    purchase.notes = data.notes
    db.commit()
    db.refresh(purchase)

    return {
        "id": purchase.id,
        "product_id": purchase.product_id,
        "product_name": purchase.product.name if purchase.product else None,
        "product_brand": purchase.product.brand if purchase.product else None,
        "quantity": purchase.quantity,
        "unit_cost": float(purchase.unit_cost),
        "shipping_fee": float(purchase.shipping_fee),
        "total_cost": float(purchase.total_cost),
        "notes": purchase.notes,
        "purchased_at": purchase.purchased_at.isoformat(),
    }


@router.delete("/{purchase_id}", status_code=204)
def void_purchase(purchase_id: int, db: Session = Depends(get_db)):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    if purchase.product_id:
        product = db.query(Product).filter(Product.id == purchase.product_id).first()
        if product:
            product.stock_quantity = max(0, product.stock_quantity - purchase.quantity)

    db.delete(purchase)
    db.commit()


@router.get("/summary")
def purchase_summary(db: Session = Depends(get_db)):
    total = db.query(func.sum(Purchase.total_cost)).scalar() or 0
    count = db.query(func.count(Purchase.id)).scalar() or 0
    return {"total_spent": float(total), "total_purchases": int(count)}
