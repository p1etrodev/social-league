from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.config import settings


class PostCreate(BaseModel):
    champion_id: str = Field(min_length=1, max_length=64)
    content: str = Field(min_length=1, max_length=settings.post_max_length)


class ResponseCreate(PostCreate):
    pass


class QuoteCreate(PostCreate):
    pass


class PostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    champion_id: str
    content: str
    response_of: UUID | None
    quote_of: UUID | None
    repost_of: UUID | None
    responses_count: int
    quotes_count: int


class PostListRead(BaseModel):
    posts: list[PostRead]
    count: int
