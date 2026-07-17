import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.models import Post


def _counts_query():
    """Correlated subqueries so responses_count/quotes_count come back on
    every row, mirroring the embedded counts the old PostgREST
    `posts_v2!response_of(count)` select used to provide. Each subquery
    needs its own aliased Post so it counts *children* of the outer row
    instead of comparing the outer row's columns to itself."""
    responses = aliased(Post)
    quotes = aliased(Post)
    responses_count = (
        select(func.count())
        .select_from(responses)
        .where(responses.response_of == Post.id)
        .correlate(Post)
        .scalar_subquery()
    )
    quotes_count = (
        select(func.count())
        .select_from(quotes)
        .where(quotes.quote_of == Post.id)
        .correlate(Post)
        .scalar_subquery()
    )
    return responses_count, quotes_count


def _select_posts():
    responses_count, quotes_count = _counts_query()
    return select(
        Post,
        responses_count.label("responses_count"),
        quotes_count.label("quotes_count"),
    )


def _row_to_dict(row) -> dict:
    post, responses_count, quotes_count = row
    return {
        "id": post.id,
        "created_at": post.created_at,
        "champion_id": post.champion_id,
        "content": post.content,
        "response_of": post.response_of,
        "quote_of": post.quote_of,
        "repost_of": post.repost_of,
        "responses_count": responses_count,
        "quotes_count": quotes_count,
    }


async def get_post(db: AsyncSession, post_id: uuid.UUID) -> dict | None:
    query = _select_posts().where(Post.id == post_id)
    result = await db.execute(query)
    row = result.first()
    return _row_to_dict(row) if row else None


async def list_root_posts(
    db: AsyncSession, champion_id: str | None, limit: int, offset: int
) -> tuple[list[dict], int]:
    query = _select_posts().where(Post.response_of.is_(None))
    count_query = select(func.count()).select_from(Post).where(Post.response_of.is_(None))
    if champion_id:
        query = query.where(Post.champion_id == champion_id)
        count_query = count_query.where(Post.champion_id == champion_id)

    query = query.order_by(Post.created_at.asc()).limit(limit).offset(offset)
    rows = (await db.execute(query)).all()
    count = (await db.execute(count_query)).scalar_one()
    return [_row_to_dict(r) for r in rows], count


async def list_responses(
    db: AsyncSession,
    *,
    post_id: uuid.UUID | None = None,
    champion_id: str | None = None,
    limit: int,
    offset: int,
) -> tuple[list[dict], int]:
    query = _select_posts().where(Post.response_of.is_not(None))
    count_query = select(func.count()).select_from(Post).where(Post.response_of.is_not(None))
    if post_id:
        query = query.where(Post.response_of == post_id)
        count_query = count_query.where(Post.response_of == post_id)
    if champion_id:
        query = query.where(Post.champion_id == champion_id)
        count_query = count_query.where(Post.champion_id == champion_id)

    query = query.order_by(Post.created_at.asc()).limit(limit).offset(offset)
    rows = (await db.execute(query)).all()
    count = (await db.execute(count_query)).scalar_one()
    return [_row_to_dict(r) for r in rows], count


async def list_quotes(
    db: AsyncSession,
    *,
    post_id: uuid.UUID | None = None,
    champion_id: str | None = None,
    limit: int,
    offset: int,
) -> tuple[list[dict], int]:
    query = _select_posts().where(Post.quote_of.is_not(None))
    count_query = select(func.count()).select_from(Post).where(Post.quote_of.is_not(None))
    if post_id:
        query = query.where(Post.quote_of == post_id)
        count_query = count_query.where(Post.quote_of == post_id)
    if champion_id:
        query = query.where(Post.champion_id == champion_id)
        count_query = count_query.where(Post.champion_id == champion_id)

    query = query.order_by(Post.created_at.asc()).limit(limit).offset(offset)
    rows = (await db.execute(query)).all()
    count = (await db.execute(count_query)).scalar_one()
    return [_row_to_dict(r) for r in rows], count


async def create_post(
    db: AsyncSession,
    *,
    champion_id: str,
    content: str,
    response_of: uuid.UUID | None = None,
    quote_of: uuid.UUID | None = None,
) -> dict:
    post = Post(
        champion_id=champion_id,
        content=content,
        response_of=response_of,
        quote_of=quote_of,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return await get_post(db, post.id)
