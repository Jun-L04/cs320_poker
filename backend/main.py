# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List

app = FastAPI()


class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, Dict[str, WebSocket]] = (
            {}
        )  # room_id -> {username: WebSocket}

    async def connect(self, room_id: str, username: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = {}
        self.rooms[room_id][username] = websocket
        await self.broadcast(room_id)

    def disconnect(self, room_id: str, username: str):
        if room_id in self.rooms and username in self.rooms[room_id]:
            del self.rooms[room_id][username]
            if not self.rooms[room_id]:  # no one left in room
                del self.rooms[room_id]

    async def broadcast(self, room_id: str):
        usernames = list(self.rooms.get(room_id, {}).keys())
        for ws in self.rooms.get(room_id, {}).values():
            await ws.send_json({"type": "update_players", "players": usernames})


manager = RoomManager()


@app.websocket("/ws/{room_id}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, username: str):
    await manager.connect(room_id, username, websocket)
    try:
        while True:
            await websocket.receive_text()  # we don't use the message, just keep connection open
    except WebSocketDisconnect:
        manager.disconnect(room_id, username)
        await manager.broadcast(room_id)
