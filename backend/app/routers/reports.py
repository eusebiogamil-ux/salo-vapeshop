import csv
import io
from datetime import datetime
from decimal import Decimal
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.product import Product
from ..models.sale import Sale
from ..models.purchase import Purchase
from ..models.partner import Partner

router = APIRouter(prefix="/api/reports", tags=["reports"])


def _margin_pct(price: Decimal, cost: Decimal) -> float:
    if price == 0:
        return 0.0
    return round(float((price - cost) / price * 100), 2)


@router.get("/dashboard-stats")
def dashboard_stats(
    from_date: datetime | None = None,
    to_date: datetime | None = None,
    db: Session = Depends(get_db),
):
    products = db.query(Product).filter(Product.is_active == True).all()
    total_skus = len(products)
    total_stock_value = sum(p.price * p.stock_quantity for p in products)
    total_inventory_cost = sum(p.cost_price * p.stock_quantity for p in products)
    low_stock_count = sum(1 for p in products if p.stock_quantity <= p.low_stock_threshold)

    # Today snapshot (always today regardless of period filter)
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_revenue = db.query(func.sum(Sale.quantity_sold * Sale.unit_price)).filter(Sale.sold_at >= today_start).scalar() or Decimal("0")
    today_units = db.query(func.sum(Sale.quantity_sold)).filter(Sale.sold_at >= today_start).scalar() or 0
    today_cost = db.query(func.sum(Sale.quantity_sold * Sale.unit_cost)).filter(Sale.sold_at >= today_start).scalar() or Decimal("0")

    # All-time totals (always — used for cash on hand and balance sheet)
    total_capital = db.query(func.sum(Partner.capital)).scalar() or Decimal("0")
    total_spent = db.query(func.sum(Purchase.total_cost)).scalar() or Decimal("0")
    atl_revenue = db.query(func.sum(Sale.quantity_sold * Sale.unit_price)).scalar() or Decimal("0")
    atl_cost = db.query(func.sum(Sale.quantity_sold * Sale.unit_cost)).scalar() or Decimal("0")
    atl_units = db.query(func.sum(Sale.quantity_sold)).scalar() or 0
    atl_gross_profit = float(atl_revenue) - float(atl_cost)
    cash_on_hand = float(total_capital) + float(atl_revenue)

    # Uncollected cash (always all-time)
    uncollected = db.query(func.sum(Sale.quantity_sold * Sale.unit_price)).filter(Sale.cash_collected == False).scalar() or Decimal("0")
    uncollected_count = db.query(func.count(Sale.id)).filter(Sale.cash_collected == False).scalar() or 0

    # Period P&L (filtered when from_date/to_date provided, otherwise mirrors all-time)
    pq_rev = db.query(func.sum(Sale.quantity_sold * Sale.unit_price))
    pq_cost = db.query(func.sum(Sale.quantity_sold * Sale.unit_cost))
    pq_units = db.query(func.sum(Sale.quantity_sold))
    if from_date:
        pq_rev = pq_rev.filter(Sale.sold_at >= from_date)
        pq_cost = pq_cost.filter(Sale.sold_at >= from_date)
        pq_units = pq_units.filter(Sale.sold_at >= from_date)
    if to_date:
        pq_rev = pq_rev.filter(Sale.sold_at <= to_date)
        pq_cost = pq_cost.filter(Sale.sold_at <= to_date)
        pq_units = pq_units.filter(Sale.sold_at <= to_date)

    total_revenue = pq_rev.scalar() or Decimal("0")
    total_cost = pq_cost.scalar() or Decimal("0")
    total_units = pq_units.scalar() or 0
    gross_profit = float(total_revenue) - float(total_cost)

    return {
        # Inventory (always current)
        "total_skus": total_skus,
        "total_stock_value": float(total_stock_value),
        "total_inventory_cost": float(total_inventory_cost),
        "low_stock_count": low_stock_count,
        # Capital & cash (always all-time)
        "total_capital": float(total_capital),
        "total_spent": float(total_spent),
        "cash_on_hand": round(cash_on_hand, 2),
        # Receivables (always all-time)
        "total_receivable": float(uncollected),
        "unpaid_count": int(uncollected_count),
        # Today snapshot
        "today_revenue": float(today_revenue),
        "today_units": int(today_units),
        "today_gross_profit": round(float(today_revenue) - float(today_cost), 2),
        # All-time P&L (for balance sheet equity)
        "atl_revenue": float(atl_revenue),
        "atl_cost": float(atl_cost),
        "atl_gross_profit": round(atl_gross_profit, 2),
        "atl_units": int(atl_units),
        # Period P&L (for KPI cards and income statement — filtered or all-time)
        "total_revenue": float(total_revenue),
        "total_cost": float(total_cost),
        "gross_profit": round(gross_profit, 2),
        "total_units": int(total_units),
    }


@router.get("/monthly-pl")
def monthly_pl(db: Session = Depends(get_db)):
    rows = (
        db.query(
            func.extract("year", Sale.sold_at).label("year"),
            func.extract("month", Sale.sold_at).label("month"),
            func.sum(Sale.quantity_sold).label("units"),
            func.sum(Sale.quantity_sold * Sale.unit_price).label("revenue"),
            func.sum(Sale.quantity_sold * Sale.unit_cost).label("cogs"),
        )
        .group_by("year", "month")
        .order_by(func.extract("year", Sale.sold_at).desc(), func.extract("month", Sale.sold_at).desc())
        .all()
    )
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return [
        {
            "year": int(r.year),
            "month": int(r.month),
            "label": f"{month_names[int(r.month) - 1]} {int(r.year)}",
            "units": int(r.units or 0),
            "revenue": float(r.revenue or 0),
            "cogs": float(r.cogs or 0),
            "gross_profit": round(float(r.revenue or 0) - float(r.cogs or 0), 2),
        }
        for r in rows
    ]


def _inventory_summary_data(db: Session) -> list[dict]:
    products = db.query(Product).filter(Product.is_active == True).order_by(Product.brand, Product.name).all()
    rows = []
    for p in products:
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
            "stock_value": float(p.price * p.stock_quantity),
            "cost_value": float(p.cost_price * p.stock_quantity),
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
