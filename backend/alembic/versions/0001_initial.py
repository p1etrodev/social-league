"""initial posts table

Revision ID: 0001
Revises:
Create Date: 2026-07-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "posts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("champion_id", sa.String(length=64), nullable=False),
        sa.Column("content", sa.String(length=280), nullable=False),
        sa.Column("response_of", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("quote_of", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("repost_of", postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(["response_of"], ["posts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["quote_of"], ["posts.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["repost_of"], ["posts.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_posts_champion_id", "posts", ["champion_id"])
    op.create_index("ix_posts_response_of", "posts", ["response_of"])
    op.create_index("ix_posts_quote_of", "posts", ["quote_of"])
    op.create_index("ix_posts_repost_of", "posts", ["repost_of"])


def downgrade() -> None:
    op.drop_table("posts")
