from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, field_validator


class ProductBase(BaseModel):
    name: str
    brand: str
    flavor: str | None = None
    nicotine_strength: str | None = None
    size: str | None = None
    price: Decimal
    cost_price: Decimal
    stock_quantity: int = 0
    low_stock_threshold: int = 5

    @field_validator("price", "cost_price")
    @classmethod
    def price_must_be_non_negative(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("must be non-negative")
        return v

    @field_validator("stock_quantity", "low_stock_threshold")
    @classmethod
    def qty_must_be_non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("must be non-negative")
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class StockAdjust(BaseModel):
    quantity: int
    notes: str | None = None


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    @property
    def is_low_stock(self) -> bool:
        return self.stock_quantity <= self.low_stock_threshold


class ProductResponseWithLowStock(ProductResponse):
    is_low_stock: bool = False

    @classmethod
    def from_product(cls, product: "ProductResponse") -> "ProductResponseWithLowStock":
        data = product.model_dump()
        data["is_low_stock"] = product.stock_quantity <= product.low_stock_threshold
        return cls(**data)
