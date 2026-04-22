from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, field_validator


class SaleCreate(BaseModel):
    product_id: int
    quantity_sold: int
    partner_id: int | None = None
    notes: str | None = None

    @field_validator("quantity_sold")
    @classmethod
    def qty_must_be_positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("quantity_sold must be greater than 0")
        return v


class SaleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    quantity_sold: int
    unit_price: Decimal
    unit_cost: Decimal
    total_revenue: Decimal
    total_cost: Decimal
    partner_id: int | None
    notes: str | None
    sold_at: datetime
    created_at: datetime
    product_name: str | None = None
    product_brand: str | None = None
    partner_name: str | None = None
