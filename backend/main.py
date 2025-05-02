# main.py
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from typing import Dict, List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Player:
    def __init__(self,username="",websocket=None,role="client"):
        self.username = username
        self.ws = websocket
        self.role = role

    def setRole(self,role):
        self.role = role
    
    def setSocket(self,websocket):
        self.ws = websocket

    def getUsername(self):
        return self.username
    
    def getRole(self):
        return self.role
    
    def getSocket(self):
        return self.ws

# class RoomManager:
#     def __init__(self):
#         self.rooms: Dict[str, Dict[str, WebSocket]] = (
#             {}
#         )  # room_id -> {username: WebSocket}

#     async def connect(
#         self, room_id: str, username: str, websocket: WebSocket, new: bool = True
#     ):
#         await websocket.accept()
#         if room_id not in self.rooms and new:
#             self.rooms[room_id] = {}
#         elif room_id in self.rooms and new:
#             raise HTTPException(status_code=404, detail="Room already created")
#         elif room_id not in self.rooms and not new:
#             raise HTTPException(status_code=404, detail="Item not found")
#         self.rooms[room_id][username] = websocket
#         await self.broadcast(room_id)

#     def disconnect(self, room_id: str, username: str):
#         if room_id in self.rooms and username in self.rooms[room_id]:
#             del self.rooms[room_id][username]
#             if not self.rooms[room_id]:  # no one left in room
#                 del self.rooms[room_id]

#     async def broadcast(self, room_id: str):
#         usernames = list(self.rooms.get(room_id, {}).keys())
#         for ws in self.rooms.get(room_id, {}).values():
#             await ws.send_json({"type": "update_players", "players": usernames})

class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, Dict[str, Player]] = ({})

        # room_id -> {player_id: Player}

    async def connect(
        self, room_id: str, username: str, websocket: WebSocket, new: bool = True
    ):
        await websocket.accept()
        connected_player = Player(username=username,websocket=websocket)
        if room_id not in self.rooms and new:
            self.rooms[room_id] = {}
            connected_player.setRole("host")
        elif room_id in self.rooms and new:
            raise HTTPException(status_code=404, detail="Room already created")
        elif room_id not in self.rooms and not new:
            raise HTTPException(status_code=404, detail="Item not found")
        self.rooms[room_id][username] = connected_player
        await self.broadcast(room_id)

    def disconnect(self, room_id: str, username: str):
        if room_id in self.rooms and username in self.rooms[room_id]:
            del self.rooms[room_id][username]
            if not self.rooms[room_id]:  # no one left in room
                del self.rooms[room_id]

    async def broadcast(self, room_id: str):
        players = list(self.rooms.get(room_id, {}).values())

        def playerHelper(player: Player):
            return [player.getUsername(), player.getRole()]
        
        def wsHelper(player: Player):
            return player.getSocket()
        
        user_list = map(playerHelper, players)
        ws_list = map(wsHelper,players)
        # {username,ws,role}
        for ws in ws_list:
            await ws.send_json({"type": "update_players", "players": user_list})


manager = RoomManager()


@app.websocket("/ws/{room_id}/{username}/{new}")
async def websocket_endpoint(
    websocket: WebSocket, room_id: str, username: str, new: str
):
    temp = False
    if new == "True":
        temp = True
    await manager.connect(room_id, username, websocket, temp)
    try:
        while True:
            await websocket.receive_text()  # we don't use the message, just keep connection open
    except WebSocketDisconnect:
        manager.disconnect(room_id, username)
        await manager.broadcast(room_id)
