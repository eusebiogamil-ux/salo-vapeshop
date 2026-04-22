from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload, contains_eager
from fastapi import HTTPException
from ..models.product import Product
from ..models.sale import Sale
from ..schemas.sale import SaleCreate


def get_sales(
    db: Session,
    product_id: int | None = None,
    from_date: datetime | None = None,
    to_date: datetime | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Sale]:
    q = db.query(Sale).options(joinedload(Sale.product), joinedload(Sale.partner))
    if product_id:
        q = q.filter(Sale.product_id == product_id)
    if from_date:
        q = q.filter(Sale.sold_at >= from_date)
    if to_date:
        q = q.filter(Sale.sold_at <= to_date)
    return q.order_by(Sale.sold_at.desc()).offset(skip).limit(limit).all()


def get_sale(db: Session, sale_id: int) -> Sale | None:
    return db.query(Sale).options(joinedload(Sale.product), joinedload(Sale.partner)).filter(Sale.id == sale_id).first()


def create_sale(db: Session, data: SaleCreate) -> Sale:
    product = db.query(Product).filter(Product.id == data.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock_quantity < data.quantity_sold:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock. Available: {product.stock_quantity}, requested: {data.quantity_sold}",
        )

    sale = Sale(
        product_id=data.product_id,
        quantity_sold=data.quantity_sold,
        unit_price=product.price,
        unit_cost=product.cost_price,
        partner_id=data.partner_id,
        notes=data.notes,
    )
    product.stock_quantity -= data.quantity_sold
    db.add(sale)
    db.commit()
    db.refresh(sale)
    db.refresh(product)
    return sale


def void_sale(db: Session, sale: Sale) -> None:
    product = db.query(Product).filter(Product.id == sale.product_id).first()
    if product:
        product.stock_quantity += sale.quantity_sold
    db.delete(sale)
    db.commit()
