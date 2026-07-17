import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.database import get_db
from app.schemas import PostCreate, PostListRead, PostRead, QuoteCreate, ResponseCreate
from app.ws import manager

router = APIRouter(prefix="/api/v1/posts", tags=["posts"])


@router.get("", response_model=PostListRead)
async def list_posts(
    champion_id: str | None = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    posts, count = await crud.list_root_posts(db, champion_id, limit, offset)
    return {"posts": posts, "count": count}


@router.get("/{post_id}", response_model=PostRead)
async def get_post(post_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    post = await crud.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("", response_model=PostRead, status_code=201)
async def create_post(payload: PostCreate, db: AsyncSession = Depends(get_db)):
    post = await crud.create_post(
        db, champion_id=payload.champion_id, content=payload.content
    )
    await manager.broadcast({"event": "new_post", "post_id": str(post["id"])})
    return post


@router.get("/{post_id}/responses", response_model=PostListRead)
async def list_responses(
    post_id: uuid.UUID,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    if not await crud.get_post(db, post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    responses, count = await crud.list_responses(
        db, post_id=post_id, limit=limit, offset=offset
    )
    return {"posts": responses, "count": count}


@router.post("/{post_id}/responses", response_model=PostRead, status_code=201)
async def create_response(
    post_id: uuid.UUID, payload: ResponseCreate, db: AsyncSession = Depends(get_db)
):
    if not await crud.get_post(db, post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    response = await crud.create_post(
        db,
        champion_id=payload.champion_id,
        content=payload.content,
        response_of=post_id,
    )
    await manager.broadcast({"event": "new_post", "post_id": str(response["id"])})
    return response


@router.get("/{post_id}/quotes", response_model=PostListRead)
async def list_quotes(
    post_id: uuid.UUID,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    if not await crud.get_post(db, post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    quotes, count = await crud.list_quotes(
        db, post_id=post_id, limit=limit, offset=offset
    )
    return {"posts": quotes, "count": count}


@router.post("/{post_id}/quotes", response_model=PostRead, status_code=201)
async def create_quote(
    post_id: uuid.UUID, payload: QuoteCreate, db: AsyncSession = Depends(get_db)
):
    if not await crud.get_post(db, post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    quote = await crud.create_post(
        db, champion_id=payload.champion_id, content=payload.content, quote_of=post_id
    )
    await manager.broadcast({"event": "new_post", "post_id": str(quote["id"])})
    return quote
