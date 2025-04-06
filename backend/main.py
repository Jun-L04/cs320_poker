from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from typing import List, Dict
from pydantic import BaseModel
import logging

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

app = FastAPI()

# class for game rooms and its associated players
class GameRoom:
    def __init__(self, name: str, max_player: int):
        self.name = name
        self.max_player = max_player
        self.players: List[str, WebSocket] = []

    def add_player(self, player: str, websocket: WebSocket) -> bool:
        if len(self.players) < self.max_player:
            self.players.update({player, websocket})
            return True
        return False
    
    def remove_player(self, player: str) -> bool:
        if player in self.players:
            del self.players[player]
            return True
        return False

    def get_player_count(self):
        return len(self.players)

class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, GameRoom] = ({})

    async def create(self, room_name:str, room_capacity: int, username: str, websocket: WebSocket):
        await websocket.accept()
        try:
         if room_name not in self.rooms:
            self.rooms[room_name] = GameRoom(room_name,room_capacity)
        except:
            raise Exception("A room with this name has already been created!")
        self.rooms[room_name].add_player(username, websocket)
        await self.broadcast(room_name)
        
    async def connect(self, room_name:str, username: str, websocket: WebSocket):
        await websocket.accept()
        try:
            self.rooms[room_name].add_player(username, websocket)
        except:
            raise Exception("Unable to join the requested room")
        await self.broadcast(room_name)

    def disconnect(self, room_name:str, username:str):
        if room_name in self.rooms and username in self.rooms[room_name]:
            self.rooms[room_name].remove_player(username)
        if not self.rooms[room_name].get_player_count():
            del self.rooms[room_name]

    async def broadcast(self, room_id: str):
        usernames = list(self.rooms.get(room_id, {}).keys())
        for ws in self.rooms.get(room_id, {}).values():
            await ws.send_json({"type": "update_players", "players": usernames})

# rooms: Dict[str, GameRoom] = {}
manager = RoomManager()

# this describes the type of data the POST request
# to create a game room will receive
class CreateGameRequest(BaseModel):
    name: str
    max_player: int
    username: str
    password: str


@app.post("/create_game/")
async def create_game(request: CreateGameRequest):
    logger.debug("creating game room...")
    # validate create room
    if not validate_create_room_request(request):
        return {"message": "Incorrect attributes!"}
    
    request_name = request.name
    request_capacity = request.max_player
    request_user = request.username
    request_websocket = WebSocket(`ws://localhost:8000/ws/${room}/${username}`)
    # if request_name not in manager.rooms:
    #     # manager.rooms[request_name] = GameRoom(request_name, request_capacity)
    #     # return {"message": "Game room created!"}
    # ## TODO players with the same name?
    # return {"message": "Game room already exists!"}
    manager.create(request_name, request_capacity,request_user)

def validate_create_room_request(request: CreateGameRequest):
    """Ensures that the request to create a room is valid and acceptable

    Args:
        request (CreateGameRequest): _description_
    """
    requested_name = request.name
    requested_max_player = request.max_player
    requested_password = request.password
    
    # numerical constraint on max_player
    # more than 1, no more than 8
    if requested_max_player <= 1 or requested_max_player > 8:
        #return {"message:": "Enter a valid count for max number of players, between 1 and 8."}
        return False
    else:
        return True
    # more stuff

@app.websocket("/ws/{room_id}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, username: str):
    await manager.connect(room_id, username, websocket)
    try:
        while True:
            await websocket.receive_text()  # we don't use the message, just keep connection open
    except WebSocketDisconnect:
        manager.disconnect(room_id, username)
        await manager.broadcast(room_id)