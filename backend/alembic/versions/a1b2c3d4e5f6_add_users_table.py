"""add users table

Revision ID: a1b2c3d4e5f6
Revises: ff775dfc2ad3
Create Date: 2026-04-24 10:00:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: str | None = "ff775dfc2ad3"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("full_name", sa.String(), nullable=True),
        sa.Column("institution", sa.String(), nullable=True),
        sa.Column("role", sa.String(), nullable=False, server_default="participant"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("email_verify_token", sa.String(), nullable=True),
        sa.Column("password_reset_token", sa.String(), nullable=True),
        sa.Column("password_reset_expires", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_email_verify_token"), "users", ["email_verify_token"], unique=False)
    op.create_index(op.f("ix_users_password_reset_token"), "users", ["password_reset_token"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_users_password_reset_token"), table_name="users")
    op.drop_index(op.f("ix_users_email_verify_token"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
