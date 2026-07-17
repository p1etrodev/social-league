from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import champions, posts, ws

app = FastAPI(title="Social League API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts.router)
app.include_router(champions.router)
app.include_router(ws.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
