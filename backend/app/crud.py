import uuid
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.models import Post, Reaction
from app.schemas import ReactionEmoji


def _counts_query():
    """Correlated subqueries so responses_count/quotes_count come back on
    every row, mirroring the embedded counts the old PostgREST
    `posts_v2!response_of(count)` select used to provide. Each subquery
    needs its own aliased Post so it counts *children* of the outer row
    instead of comparing the outer row's columns to itself."""
    responses = aliased(Post)
    quotes = aliased(Post)
    reposts = aliased(Post)
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
    reposts_count = (
        select(func.count())
        .select_from(reposts)
        .where(reposts.repost_of == Post.id)
        .correlate(Post)
        .scalar_subquery()
    )
    return responses_count, quotes_count, reposts_count


def _select_posts():
    responses_count, quotes_count, reposts_count = _counts_query()
    return select(
        Post,
        responses_count.label("responses_count"),
        quotes_count.label("quotes_count"),
        reposts_count.label("reposts_count"),
    )


def _row_to_dict(row) -> dict:
    post, responses_count, quotes_count, reposts_count = row
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
        "reposts_count": reposts_count,
    }


async def get_post(db: AsyncSession, post_id: uuid.UUID) -> dict | None:
    query = _select_posts().where(Post.id == post_id)
    result = await db.execute(query)
    row = result.first()
    return _row_to_dict(row) if row else None


async def list_root_posts(
    db: AsyncSession,
    champion_id: str | None,
    limit: int,
    offset: int,
    include_responses: bool = False,
) -> tuple[list[dict], int]:
    query = _select_posts()
    count_query = select(func.count()).select_from(Post)
    if not include_responses:
        query = query.where(Post.response_of.is_(None))
        count_query = count_query.where(Post.response_of.is_(None))
    if champion_id:
        query = query.where(Post.champion_id == champion_id)
        count_query = count_query.where(Post.champion_id == champion_id)

    query = query.order_by(Post.created_at.desc()).limit(limit).offset(offset)
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

    query = query.order_by(Post.created_at.desc()).limit(limit).offset(offset)
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

    query = query.order_by(Post.created_at.desc()).limit(limit).offset(offset)
    rows = (await db.execute(query)).all()
    count = (await db.execute(count_query)).scalar_one()
    return [_row_to_dict(r) for r in rows], count


async def list_reposts(
    db: AsyncSession,
    *,
    post_id: uuid.UUID | None = None,
    champion_id: str | None = None,
    limit: int,
    offset: int,
) -> tuple[list[dict], int]:
    query = _select_posts().where(Post.repost_of.is_not(None))
    count_query = select(func.count()).select_from(Post).where(Post.repost_of.is_not(None))
    if post_id:
        query = query.where(Post.repost_of == post_id)
        count_query = count_query.where(Post.repost_of == post_id)
    if champion_id:
        query = query.where(Post.champion_id == champion_id)
        count_query = count_query.where(Post.champion_id == champion_id)

    query = query.order_by(Post.created_at.desc()).limit(limit).offset(offset)
    rows = (await db.execute(query)).all()
    count = (await db.execute(count_query)).scalar_one()
    return [_row_to_dict(r) for r in rows], count


async def list_trending(db: AsyncSession, *, since: datetime, limit: int) -> list[dict]:
    responses_count, quotes_count, reposts_count = _counts_query()
    engagement = quotes_count + reposts_count
    query = (
        select(
            Post,
            responses_count.label("responses_count"),
            quotes_count.label("quotes_count"),
            reposts_count.label("reposts_count"),
        )
        .where(Post.response_of.is_(None), Post.created_at >= since)
        .order_by(engagement.desc(), Post.created_at.desc())
        .limit(limit)
    )
    rows = (await db.execute(query)).all()
    return [_row_to_dict(r) for r in rows]


async def list_champion_streak(db: AsyncSession, *, since: datetime, limit: int) -> list[dict]:
    """Champions ranked by how many posts (root posts, responses, quotes,
    reposts alike -- any action counts as activity) they've authored since
    `since`. There's no local champion table, so this is a plain GROUP BY
    over the free-text champion_id column."""
    query = (
        select(Post.champion_id, func.count().label("activity"))
        .where(Post.created_at >= since)
        .group_by(Post.champion_id)
        .order_by(func.count().desc())
        .limit(limit)
    )
    rows = (await db.execute(query)).all()
    return [{"champion_id": champion_id, "activity": activity} for champion_id, activity in rows]


async def toggle_reaction(
    db: AsyncSession, *, post_id: uuid.UUID, anon_id: str, emoji: ReactionEmoji
) -> None:
    existing = await db.execute(
        select(Reaction).where(
            Reaction.post_id == post_id, Reaction.anon_id == anon_id, Reaction.emoji == emoji
        )
    )
    row = existing.scalar_one_or_none()
    if row:
        await db.delete(row)
    else:
        db.add(Reaction(post_id=post_id, anon_id=anon_id, emoji=emoji))
    await db.commit()


async def get_reaction_summary(db: AsyncSession, *, post_id: uuid.UUID, anon_id: str) -> dict:
    counts = {emoji.value: 0 for emoji in ReactionEmoji}
    counts_query = (
        select(Reaction.emoji, func.count())
        .where(Reaction.post_id == post_id)
        .group_by(Reaction.emoji)
    )
    for emoji, count in (await db.execute(counts_query)).all():
        counts[emoji] = count

    mine_query = select(Reaction.emoji).where(
        Reaction.post_id == post_id, Reaction.anon_id == anon_id
    )
    mine = (await db.execute(mine_query)).scalars().all()
    return {"counts": counts, "mine": list(mine)}


async def create_post(
    db: AsyncSession,
    *,
    champion_id: str,
    content: str,
    response_of: uuid.UUID | None = None,
    quote_of: uuid.UUID | None = None,
    repost_of: uuid.UUID | None = None,
) -> dict:
    post = Post(
        champion_id=champion_id,
        content=content,
        response_of=response_of,
        quote_of=quote_of,
        repost_of=repost_of,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return await get_post(db, post.id)
