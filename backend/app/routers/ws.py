from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.ws import manager

router = APIRouter()


@router.websocket("/ws/posts")
async def posts_ws(websocket: WebSocket):
    """Replaces the old Supabase Realtime channel('new_posts') subscription:
    clients get a message every time a post/response/quote is created."""
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep the connection alive; no client->server messages expected
    except WebSocketDisconnect:
        manager.disconnect(websocket)
