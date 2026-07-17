from datetime import datetime
from enum import Enum
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from app.config import settings


class CamelModel(BaseModel):
    """Base for every schema exposed over the wire: the API speaks camelCase
    (championId, createdAt, ...) while the rest of the codebase stays
    snake_case (Python fields, SQLAlchemy attributes, crud.py dict keys).
    `populate_by_name=True` lets internal code build these models from
    snake_case dicts/attributes while external requests must use the
    camelCase alias; FastAPI serializes responses by alias by default."""

    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, from_attributes=True
    )


class PostCreate(CamelModel):
    champion_id: Annotated[str, Field(min_length=1, max_length=64)]
    content: Annotated[str, Field(min_length=1, max_length=settings.post_max_length)]


class ResponseCreate(PostCreate):
    pass


class QuoteCreate(PostCreate):
    pass


class RepostCreate(CamelModel):
    champion_id: Annotated[str, Field(min_length=1, max_length=64)]


class PostRead(CamelModel):
    id: UUID
    created_at: datetime
    champion_id: str
    content: str
    response_of: UUID | None
    quote_of: UUID | None
    repost_of: UUID | None
    responses_count: int
    quotes_count: int
    reposts_count: int


class PostListRead(CamelModel):
    posts: list[PostRead]
    count: int


class ReactionEmoji(str, Enum):
    """Fixed set on purpose -- open-ended emoji input invites spam, and a
    small curated set of League-flavored reactions (a lighter-weight
    engagement layer than quoting/responding) is the actual feature."""

    pentakill = "⚡"
    gg = "🛡️"
    ace = "💀"


class ReactionToggle(CamelModel):
    # Client-generated, localStorage-persisted id -- see Reaction.anon_id.
    anon_id: Annotated[str, Field(min_length=1, max_length=64)]
    emoji: ReactionEmoji


class ReactionSummary(CamelModel):
    counts: dict[str, int]
    mine: list[str]
