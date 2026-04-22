from datetime import datetime
from decimal import Decimal
from sqlalchemy import Boolean, CheckConstraint, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import TIMESTAMP
from ..database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    brand: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    flavor: Mapped[str | None] = mapped_column(String(100))
    nicotine_strength: Mapped[str | None] = mapped_column(String(20))
    size: Mapped[str | None] = mapped_column(String(50))
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    cost_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    stock_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    low_stock_threshold: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    sales: Mapped[list["Sale"]] = relationship("Sale", back_populates="product")  # noqa: F821

    __table_args__ = (
        CheckConstraint("price >= 0", name="ck_products_price"),
        CheckConstraint("cost_price >= 0", name="ck_products_cost_price"),
        CheckConstraint("stock_quantity >= 0", name="ck_products_stock_quantity"),
        CheckConstraint("low_stock_threshold >= 0", name="ck_products_low_stock_threshold"),
    )
