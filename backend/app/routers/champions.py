from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.database import get_db
from app.schemas import PostListRead

router = APIRouter(prefix="/api/v1/champions", tags=["champions"])


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
