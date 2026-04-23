from decimal import Decimal
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.credit import Credit

router = APIRouter(prefix="/api/credits", tags=["credits"])


class CreditCreate(BaseModel):
    customer_name: str
    amount: Decimal
    description: str | None = None
    due_date: date | None = None


class PaymentIn(BaseModel):
    amount_paid: Decimal


def _fmt(c: Credit) -> dict:
    balance = float(c.amount) - float(c.amount_paid)
    return {
        "id": c.id,
        "customer_name": c.customer_name,
        "amount": float(c.amount),
        "amount_paid": float(c.amount_paid),
        "balance": round(balance, 2),
        "description": c.description,
        "due_date": c.due_date.isoformat() if c.due_date else None,
        "is_settled": c.is_settled,
        "created_at": c.created_at.isoformat(),
    }


@router.get("")
def list_credits(settled: bool | None = None, db: Session = Depends(get_db)):
    q = db.query(Credit).order_by(Credit.created_at.desc())
    if settled is not None:
        q = q.filter(Credit.is_settled == settled)
    return [_fmt(c) for c in q.all()]


@router.post("", status_code=201)
def create_credit(data: CreditCreate, db: Session = Depends(get_db)):
    credit = Credit(
        customer_name=data.customer_name,
        amount=data.amount,
        amount_paid=Decimal("0"),
        description=data.description,
        due_date=data.due_date,
        is_settled=False,
    )
    db.add(credit)
    db.commit()
    db.refresh(credit)
    return _fmt(credit)


@router.patch("/{credit_id}/pay")
def record_payment(credit_id: int, data: PaymentIn, db: Session = Depends(get_db)):
    credit = db.query(Credit).filter(Credit.id == credit_id).first()
    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")
    credit.amount_paid = min(credit.amount, credit.amount_paid + data.amount_paid)
    credit.is_settled = credit.amount_paid >= credit.amount
    db.commit()
    db.refresh(credit)
    return _fmt(credit)


@router.patch("/{credit_id}/settle")
def settle_credit(credit_id: int, db: Session = Depends(get_db)):
    credit = db.query(Credit).filter(Credit.id == credit_id).first()
    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")
    credit.amount_paid = credit.amount
    credit.is_settled = True
    db.commit()
    db.refresh(credit)
    return _fmt(credit)


@router.delete("/{credit_id}", status_code=204)
def delete_credit(credit_id: int, db: Session = Depends(get_db)):
    credit = db.query(Credit).filter(Credit.id == credit_id).first()
    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")
    db.delete(credit)
    db.commit()


@router.get("/summary")
def credit_summary(db: Session = Depends(get_db)):
    total = db.query(func.sum(Credit.amount)).filter(Credit.is_settled == False).scalar() or 0
    total_paid = db.query(func.sum(Credit.amount_paid)).filter(Credit.is_settled == False).scalar() or 0
    count = db.query(func.count(Credit.id)).filter(Credit.is_settled == False).scalar() or 0
    return {
        "total_outstanding": round(float(total) - float(total_paid), 2),
        "unpaid_count": int(count),
    }
