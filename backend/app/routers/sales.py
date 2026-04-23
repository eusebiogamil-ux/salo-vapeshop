from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.sale import SaleCreate, SaleResponse
from ..models.sale import Sale
from .. import crud

router = APIRouter(prefix="/api/sales", tags=["sales"])


def _to_response(sale) -> dict:
    return {
        "id": sale.id,
        "product_id": sale.product_id,
        "quantity_sold": sale.quantity_sold,
        "unit_price": sale.unit_price,
        "unit_cost": sale.unit_cost,
        "total_revenue": sale.total_revenue,
        "total_cost": sale.total_cost,
        "partner_id": sale.partner_id,
        "cash_collected": sale.cash_collected,
        "notes": sale.notes,
        "sold_at": sale.sold_at,
        "created_at": sale.created_at,
        "product_name": sale.product.name if sale.product else None,
        "product_brand": sale.product.brand if sale.product else None,
        "partner_name": sale.partner.name if sale.partner else None,
    }


@router.get("")
def list_sales(
    product_id: int | None = None,
    from_date: datetime | None = None,
    to_date: datetime | None = None,
    cash_collected: bool | None = None,
    skip: int = 0,
    limit: int = 200,
    db: Session = Depends(get_db),
):
    sales = crud.sale.get_sales(db, product_id=product_id, from_date=from_date, to_date=to_date, skip=skip, limit=limit)
    if cash_collected is not None:
        sales = [s for s in sales if s.cash_collected == cash_collected]
    return [_to_response(s) for s in sales]


@router.post("", status_code=201)
def create_sale(data: SaleCreate, db: Session = Depends(get_db)):
    sale = crud.sale.create_sale(db, data)
    db.refresh(sale)
    sale_with_product = crud.sale.get_sale(db, sale.id)
    return _to_response(sale_with_product)


@router.patch("/{sale_id}/collect")
def mark_collected(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    sale.cash_collected = True
    db.commit()
    sale_full = crud.sale.get_sale(db, sale_id)
    return _to_response(sale_full)


@router.get("/{sale_id}")
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = crud.sale.get_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return _to_response(sale)


@router.delete("/{sale_id}", status_code=204)
def void_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = crud.sale.get_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    crud.sale.void_sale(db, sale)
