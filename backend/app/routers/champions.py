from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.database import get_db
from app.schemas import ChampionStreakList, PostListRead

router = APIRouter(prefix="/api/v1/champions", tags=["champions"])


# Registered before "/{champion_id}/..." routes -- none of them are a bare
# "/{champion_id}" today, but keeping literal-path routes first avoids the
# shadowing gotcha already documented in posts.py if that ever changes.
@router.get("/streak", response_model=ChampionStreakList)
async def get_champion_streak(
    hours: int = 24,
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
):
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    champions = await crud.list_champion_streak(db, since=since, limit=limit)
    return {"champions": champions}


@router.get("/{champion_id}/posts", response_model=PostListRead)
async def list_champion_posts(
    champion_id: str, limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)
):
    posts, count = await crud.list_root_posts(db, champion_id, limit, offset)
    return {"posts": posts, "count": count}


@router.get("/{champion_id}/responses", response_model=PostListRead)
async def list_champion_responses(
    champion_id: str, limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)
):
    responses, count = await crud.list_responses(
        db, champion_id=champion_id, limit=limit, offset=offset
    )
    return {"posts": responses, "count": count}


@router.get("/{champion_id}/quotes", response_model=PostListRead)
async def list_champion_quotes(
    champion_id: str, limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)
):
    quotes, count = await crud.list_quotes(
        db, champion_id=champion_id, limit=limit, offset=offset
    )
    return {"posts": quotes, "count": count}


@router.get("/{champion_id}/reposts", response_model=PostListRead)
async def list_champion_reposts(
    champion_id: str, limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)
):
    reposts, count = await crud.list_reposts(
        db, champion_id=champion_id, limit=limit, offset=offset
    )
    return {"posts": reposts, "count": count}
