from datetime import datetime
from decimal import Decimal
from sqlalchemy import CheckConstraint, ForeignKey, Integer, Numeric, Text, Boolean, func, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import TIMESTAMP
from ..database import Base


class Sale(Base):
    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False, index=True)
    quantity_sold: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    unit_cost: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    partner_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("partners.id", ondelete="SET NULL"), nullable=True, index=True)
    cash_collected: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    notes: Mapped[str | None] = mapped_column(Text)
    sold_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), index=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

    product: Mapped["Product"] = relationship("Product", back_populates="sales")  # noqa: F821
    partner: Mapped["Partner"] = relationship("Partner", back_populates="sales")  # noqa: F821

    __table_args__ = (
        CheckConstraint("quantity_sold > 0", name="ck_sales_quantity_sold"),
        CheckConstraint("unit_price >= 0", name="ck_sales_unit_price"),
        CheckConstraint("unit_cost >= 0", name="ck_sales_unit_cost"),
    )

    @property
    def total_revenue(self) -> Decimal:
        return self.quantity_sold * self.unit_price

    @property
    def total_cost(self) -> Decimal:
        return self.quantity_sold * self.unit_cost
