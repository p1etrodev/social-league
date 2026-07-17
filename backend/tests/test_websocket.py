import asyncio
import uuid

from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.database import Base, get_db
from app.main import app


def test_new_post_broadcasts_to_websocket_clients():
    # Deliberately sync + self-contained (not the async `client`/`db_session`
    # fixtures): TestClient drives its own event loop via an anyio portal,
    # which conflicts with an engine created inside a pytest-asyncio fixture's
    # loop.
    engine = create_async_engine(
        f"sqlite+aiosqlite:///file:{uuid.uuid4()}?mode=memory&cache=shared&uri=true"
    )
    session_factory = async_sessionmaker(engine, expire_on_commit=False)

    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(create_tables())

    async def override_get_db():
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as sync_client:
            with sync_client.websocket_connect("/ws/posts") as ws:
                r = sync_client.post(
                    "/api/v1/posts", json={"championId": "ahri", "content": "hi"}
                )
                assert r.status_code == 201
                message = ws.receive_json()
                assert message["event"] == "new_post"
                assert message["postId"] == r.json()["id"]
    finally:
        app.dependency_overrides.pop(get_db, None)
