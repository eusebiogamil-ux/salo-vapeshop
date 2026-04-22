"""Initial schema

Revision ID: 0001
Revises:
Create Date: 2026-04-21

"""
from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("brand", sa.String(100), nullable=False),
        sa.Column("flavor", sa.String(100), nullable=True),
        sa.Column("nicotine_strength", sa.String(20), nullable=True),
        sa.Column("size", sa.String(50), nullable=True),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("cost_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("stock_quantity", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("low_stock_threshold", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.CheckConstraint("price >= 0", name="ck_products_price"),
        sa.CheckConstraint("cost_price >= 0", name="ck_products_cost_price"),
        sa.CheckConstraint("stock_quantity >= 0", name="ck_products_stock_quantity"),
        sa.CheckConstraint("low_stock_threshold >= 0", name="ck_products_low_stock_threshold"),
    )
    op.create_index("ix_products_brand", "products", ["brand"])
    op.create_index("ix_products_is_active", "products", ["is_active"])

    op.execute("""
        CREATE OR REPLACE FUNCTION set_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    op.execute("""
        CREATE TRIGGER trg_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    """)

    op.create_table(
        "sales",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("quantity_sold", sa.Integer(), nullable=False),
        sa.Column("unit_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("unit_cost", sa.Numeric(10, 2), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("sold_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.CheckConstraint("quantity_sold > 0", name="ck_sales_quantity_sold"),
        sa.CheckConstraint("unit_price >= 0", name="ck_sales_unit_price"),
        sa.CheckConstraint("unit_cost >= 0", name="ck_sales_unit_cost"),
    )
    op.create_index("ix_sales_product_id", "sales", ["product_id"])
    op.create_index("ix_sales_sold_at", "sales", ["sold_at"])


def downgrade() -> None:
    op.drop_table("sales")
    op.execute("DROP TRIGGER IF EXISTS trg_products_updated_at ON products")
    op.execute("DROP FUNCTION IF EXISTS set_updated_at")
    op.drop_table("products")
