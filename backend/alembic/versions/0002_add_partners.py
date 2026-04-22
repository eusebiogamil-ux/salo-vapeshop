"""Add partners table and partner_id to sales

Revision ID: 0002
Revises: 0001
Create Date: 2026-04-21

"""
from alembic import op
import sqlalchemy as sa

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "partners",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("capital", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index("ix_partners_id", "partners", ["id"])

    # Seed the 3 partners
    op.execute("INSERT INTO partners (name) VALUES ('Seb'), ('Romel'), ('Salo')")

    op.add_column("sales", sa.Column("partner_id", sa.Integer(), nullable=True))
    op.create_foreign_key("fk_sales_partner_id", "sales", "partners", ["partner_id"], ["id"], ondelete="SET NULL")
    op.create_index("ix_sales_partner_id", "sales", ["partner_id"])


def downgrade() -> None:
    op.drop_index("ix_sales_partner_id", "sales")
    op.drop_constraint("fk_sales_partner_id", "sales", type_="foreignkey")
    op.drop_column("sales", "partner_id")
    op.drop_table("partners")
