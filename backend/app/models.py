import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    champion_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    content: Mapped[str] = mapped_column(String(280), nullable=False)

    # Self-referential relations: a post is either a root post, a response,
    # or a quote. `repost_of` exists for schema completeness (mirrors the
    # old Supabase model) but has no endpoint yet — the original app never
    # implemented reposting either.
    response_of: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    quote_of: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("posts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    repost_of: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("posts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
