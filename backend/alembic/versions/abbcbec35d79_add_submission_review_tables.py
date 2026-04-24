"""add submission review tables

Revision ID: abbcbec35d79
Revises: a1b2c3d4e5f6
Create Date: 2026-04-25 01:36:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "abbcbec35d79"
down_revision: str | None = "a1b2c3d4e5f6"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # submission_periods
    op.create_table(
        "submission_periods",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("start_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("review_deadline", sa.DateTime(timezone=True), nullable=False),
        sa.Column("rebuttal_deadline", sa.DateTime(timezone=True), nullable=False),
        sa.Column("final_decision_deadline", sa.DateTime(timezone=True), nullable=False),
        sa.Column("reviewers_per_paper", sa.Integer(), nullable=False, server_default="3"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_submission_periods_id"), "submission_periods", ["id"], unique=False)

    # submissions
    op.create_table(
        "submissions",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("period_id", sa.String(), nullable=False),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("abstract", sa.Text(), nullable=False),
        sa.Column("keywords", sa.String(1024), nullable=False),
        sa.Column("authors", sa.JSON(), nullable=False),
        sa.Column("corresponding_author", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, server_default="draft"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["period_id"], ["submission_periods.id"]),
    )
    op.create_index(op.f("ix_submissions_id"), "submissions", ["id"], unique=False)
    op.create_index(op.f("ix_submissions_user_id"), "submissions", ["user_id"], unique=False)
    op.create_index(op.f("ix_submissions_period_id"), "submissions", ["period_id"], unique=False)
    op.create_index(op.f("ix_submissions_status"), "submissions", ["status"], unique=False)

    # submission_files
    op.create_table(
        "submission_files",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("submission_id", sa.String(), nullable=False),
        sa.Column("file_name", sa.String(255), nullable=False),
        sa.Column("minio_key", sa.String(1024), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("is_current", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["submission_id"], ["submissions.id"]),
    )
    op.create_index(op.f("ix_submission_files_id"), "submission_files", ["id"], unique=False)
    op.create_index(
        op.f("ix_submission_files_submission_id"), "submission_files", ["submission_id"], unique=False
    )

    # review_assignments
    op.create_table(
        "review_assignments",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("submission_id", sa.String(), nullable=False),
        sa.Column("reviewer_id", sa.String(), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("assigned_by", sa.String(), nullable=True),
        sa.Column("assigned_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("deadline", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["submission_id"], ["submissions.id"]),
        sa.ForeignKeyConstraint(["reviewer_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["assigned_by"], ["users.id"]),
    )
    op.create_index(
        op.f("ix_review_assignments_id"), "review_assignments", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_review_assignments_submission_id"),
        "review_assignments",
        ["submission_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_review_assignments_reviewer_id"),
        "review_assignments",
        ["reviewer_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_review_assignments_status"), "review_assignments", ["status"], unique=False
    )

    # reviews
    op.create_table(
        "reviews",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("assignment_id", sa.String(), nullable=False),
        sa.Column("overall_score", sa.Integer(), nullable=False),
        sa.Column("detailed_comments", sa.Text(), nullable=False),
        sa.Column("recommendation", sa.String(50), nullable=False),
        sa.Column("is_visible_to_author", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["assignment_id"], ["review_assignments.id"]),
        sa.UniqueConstraint("assignment_id"),
    )
    op.create_index(op.f("ix_reviews_id"), "reviews", ["id"], unique=False)
    op.create_index(
        op.f("ix_reviews_assignment_id"), "reviews", ["assignment_id"], unique=True
    )

    # rebuttals
    op.create_table(
        "rebuttals",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("review_id", sa.String(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column(
            "is_visible_to_reviewer", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["review_id"], ["reviews.id"]),
        sa.UniqueConstraint("review_id"),
    )
    op.create_index(op.f("ix_rebuttals_id"), "rebuttals", ["id"], unique=False)
    op.create_index(
        op.f("ix_rebuttals_review_id"), "rebuttals", ["review_id"], unique=True
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_rebuttals_review_id"), table_name="rebuttals")
    op.drop_index(op.f("ix_rebuttals_id"), table_name="rebuttals")
    op.drop_table("rebuttals")

    op.drop_index(op.f("ix_reviews_assignment_id"), table_name="reviews")
    op.drop_index(op.f("ix_reviews_id"), table_name="reviews")
    op.drop_table("reviews")

    op.drop_index(op.f("ix_review_assignments_status"), table_name="review_assignments")
    op.drop_index(op.f("ix_review_assignments_reviewer_id"), table_name="review_assignments")
    op.drop_index(op.f("ix_review_assignments_submission_id"), table_name="review_assignments")
    op.drop_index(op.f("ix_review_assignments_id"), table_name="review_assignments")
    op.drop_table("review_assignments")

    op.drop_index(op.f("ix_submission_files_submission_id"), table_name="submission_files")
    op.drop_index(op.f("ix_submission_files_id"), table_name="submission_files")
    op.drop_table("submission_files")

    op.drop_index(op.f("ix_submissions_status"), table_name="submissions")
    op.drop_index(op.f("ix_submissions_period_id"), table_name="submissions")
    op.drop_index(op.f("ix_submissions_user_id"), table_name="submissions")
    op.drop_index(op.f("ix_submissions_id"), table_name="submissions")
    op.drop_table("submissions")

    op.drop_index(op.f("ix_submission_periods_id"), table_name="submission_periods")
    op.drop_table("submission_periods")
