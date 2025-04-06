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
        self.players: List[str] = []

    def add_player(self, player: str) -> bool:
        if len(self.players) < self.max_player:
            self.players.append(player)
            return True
        return False

rooms: Dict[str, GameRoom] = {}

# this describes the type of data the POST request
# to create a game room will receive
class CreateGameRequest(BaseModel):
    name: str
    max_player: int
    password: str


@app.post("/create_game/")
def create_game(request: CreateGameRequest):
    logger.debug("creating game room...")
    # validate create room
    if not validate_create_room_request(request):
        return {"message": "Incorrect attributes!"}
    
    request_name = request.name
    request_capacity = request.max_player
    if request_name not in rooms:
        rooms[request_name] = GameRoom(request_name, request_capacity)
        return {"message": "Game room created!"}
    ## TODO players with the same name?
    return {"message": "Game room already exists!"}

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