import csv
import io
from datetime import datetime
from decimal import Decimal
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import func, case
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.product import Product
from ..models.sale import Sale

router = APIRouter(prefix="/api/reports", tags=["reports"])


def _margin_pct(price: Decimal, cost: Decimal) -> float:
    if price == 0:
        return 0.0
    return round(float((price - cost) / price * 100), 2)


@router.get("/dashboard-stats")
def dashboard_stats(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).all()
    total_skus = len(products)
    total_stock_value = sum(p.price * p.stock_quantity for p in products)
    low_stock_count = sum(1 for p in products if p.stock_quantity <= p.low_stock_threshold)

    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_revenue = db.query(func.sum(Sale.quantity_sold * Sale.unit_price)).filter(Sale.sold_at >= today_start).scalar() or Decimal("0")

    return {
        "total_skus": total_skus,
        "total_stock_value": float(total_stock_value),
        "today_revenue": float(today_revenue),
        "low_stock_count": low_stock_count,
    }


def _inventory_summary_data(db: Session) -> list[dict]:
    products = db.query(Product).filter(Product.is_active == True).order_by(Product.brand, Product.name).all()
    rows = []
    for p in products:
        stock_value = float(p.price * p.stock_quantity)
        cost_value = float(p.cost_price * p.stock_quantity)
        rows.append({
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "flavor": p.flavor or "",
            "nicotine_strength": p.nicotine_strength or "",
            "size": p.size or "",
            "price": float(p.price),
            "cost_price": float(p.cost_price),
            "stock_quantity": p.stock_quantity,
            "low_stock_threshold": p.low_stock_threshold,
            "is_low_stock": p.stock_quantity <= p.low_stock_threshold,
            "stock_value": stock_value,
            "cost_value": cost_value,
            "margin_pct": _margin_pct(p.price, p.cost_price),
        })
    return rows


@router.get("/inventory-summary")
def inventory_summary(db: Session = Depends(get_db)):
    return _inventory_summary_data(db)


@router.get("/inventory-summary/csv")
def inventory_summary_csv(db: Session = Depends(get_db)):
    rows = _inventory_summary_data(db)
    output = io.StringIO()
    fields = ["id", "brand", "name", "flavor", "nicotine_strength", "size", "price", "cost_price",
              "stock_quantity", "low_stock_threshold", "is_low_stock", "stock_value", "cost_value", "margin_pct"]
    writer = csv.DictWriter(output, fieldnames=fields, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(rows)
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=inventory_summary.csv"},
    )


def _sales_history_data(db: Session, from_date: datetime | None, to_date: datetime | None) -> list[dict]:
    q = (
        db.query(
            Product.id.label("product_id"),
            Product.name.label("product_name"),
            Product.brand.label("product_brand"),
            func.sum(Sale.quantity_sold).label("units_sold"),
            func.sum(Sale.quantity_sold * Sale.unit_price).label("total_revenue"),
            func.sum(Sale.quantity_sold * Sale.unit_cost).label("total_cost"),
        )
        .join(Sale, Sale.product_id == Product.id)
    )
    if from_date:
        q = q.filter(Sale.sold_at >= from_date)
    if to_date:
        q = q.filter(Sale.sold_at <= to_date)
    rows_raw = q.group_by(Product.id, Product.name, Product.brand).order_by(func.sum(Sale.quantity_sold * Sale.unit_price).desc()).all()

    rows = []
    for r in rows_raw:
        revenue = float(r.total_revenue or 0)
        cost = float(r.total_cost or 0)
        rows.append({
            "product_id": r.product_id,
            "product_name": r.product_name,
            "product_brand": r.product_brand,
            "units_sold": int(r.units_sold or 0),
            "total_revenue": revenue,
            "total_cost": cost,
            "total_profit": round(revenue - cost, 2),
            "margin_pct": round((revenue - cost) / revenue * 100, 2) if revenue else 0.0,
        })
    return rows


@router.get("/sales-history")
def sales_history(
    from_date: datetime | None = None,
    to_date: datetime | None = None,
    db: Session = Depends(get_db),
):
    return _sales_history_data(db, from_date, to_date)


@router.get("/sales-history/csv")
def sales_history_csv(
    from_date: datetime | None = None,
    to_date: datetime | None = None,
    db: Session = Depends(get_db),
):
    rows = _sales_history_data(db, from_date, to_date)
    output = io.StringIO()
    fields = ["product_id", "product_brand", "product_name", "units_sold", "total_revenue", "total_cost", "total_profit", "margin_pct"]
    writer = csv.DictWriter(output, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sales_history.csv"},
    )
