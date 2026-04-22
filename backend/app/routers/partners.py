from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.partner import Partner
from ..models.sale import Sale

router = APIRouter(prefix="/api/partners", tags=["partners"])


class CapitalUpdate(BaseModel):
    capital: Decimal


@router.get("")
def list_partners(db: Session = Depends(get_db)):
    partners = db.query(Partner).order_by(Partner.id).all()
    result = []
    for p in partners:
        stats = (
            db.query(
                func.sum(Sale.quantity_sold).label("units_sold"),
                func.sum(Sale.quantity_sold * Sale.unit_price).label("total_revenue"),
                func.sum(Sale.quantity_sold * Sale.unit_cost).label("total_cost"),
            )
            .filter(Sale.partner_id == p.id)
            .first()
        )
        revenue = float(stats.total_revenue or 0)
        cost = float(stats.total_cost or 0)
        result.append({
            "id": p.id,
            "name": p.name,
            "capital": float(p.capital),
            "units_sold": int(stats.units_sold or 0),
            "total_revenue": revenue,
            "total_profit": round(revenue - cost, 2),
        })
    return result


@router.patch("/{partner_id}/capital")
def update_capital(partner_id: int, data: CapitalUpdate, db: Session = Depends(get_db)):
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    partner.capital = data.capital
    db.commit()
    db.refresh(partner)
    return {"id": partner.id, "name": partner.name, "capital": float(partner.capital)}
