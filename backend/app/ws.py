from fastapi import WebSocket


class ConnectionManager:
    """In-process pub/sub for the 'new post' notifications the old Supabase
    Realtime channel provided. A single FastAPI instance is the only writer
    now (all inserts go through this API), so there's no need for
    Postgres LISTEN/NOTIFY — broadcasting right after the insert is enough.
    """

    def __init__(self) -> None:
        self._connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self._connections.discard(websocket)

    async def broadcast(self, message: dict) -> None:
        dead = []
        for connection in self._connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead.append(connection)
        for connection in dead:
            self.disconnect(connection)


manager = ConnectionManager()
