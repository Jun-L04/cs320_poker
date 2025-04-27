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


class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, Dict[str, WebSocket]] = (
            {}
        )  # room_id -> {username: WebSocket}
        self.game_states: Dict[str, Dict] = {}  # room_id -> game state

    async def connect(
        self, room_id: str, username: str, websocket: WebSocket, new: bool = True
    ):
        await websocket.accept()
        if room_id not in self.rooms and new:
            self.rooms[room_id] = {}
        elif room_id in self.rooms and new:
            raise HTTPException(status_code=404, detail="Room already created")
        elif room_id not in self.rooms and not new:
            raise HTTPException(status_code=404, detail="Item not found")
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
            
    async def start_game(self, room_id: str):
        if room_id not in self.game_states:
            raise HTTPException(status_code=404, detail="Room not found")
        self.game_states[room_id]["game_active"] = True
        self.game_states[room_id]["turn_index"] = 0
        self.game_states[room_id]["pot"] = 0
        self.game_states[room_id]["round_count"] = 1
        await self.broadcast(room_id)
    
    async def handle_action(self, room_id: str, username: str, action: str, amount: int = 0):
        state = self.game_states.get(room_id)
        if not state or not state["game_active"]:
            raise HTTPException(status_code=400, detail="Game Session Currently Not Active")
        
        if state["players"][state["turn_index"]] != username:
            raise HTTPException(status_code=403, detail="Not yet your turn!")
        
        if action == "bet":
            if state["chip_balances"][username] < amount:
                raise HTTPException(status_code=400, detail="Insufficient chips")
            state["chip_balances"][username] -= amount
            state["pot"] += amount
        elif action == "fold": # skipping this player's turn 
            state["players"].remove(username) # remove from list
        # moving turn
        state["turn_index"] = (state["turn_index"] + 1) % len(state["players"])
        if len(state["players"]) == 1:  # one player left
            await self.end_game(room_id, state["players"][0]) # TODO winner caluclation, this is placeholder
            # reset pot
            state["pot"] = 0
            # if maximum round has been reached
            # hardcoded as a max of 3 rounds
            if state["round_count"] >= 3:
                await self.end_game(room_id, state["players"][0]) # TODO winner calculation
            else:
                # changing basic attributes for next round
                state["round_count"] += 1
                state["players"] = list(self.rooms[room_id].keys())
                state["turn_index"] = 0
                await self.broadcast(room_id)
        else:
            await self.broadcast(room_id)
        
        
    async def end_game(self, room_id: str, winner: str):
        state = self.game_states.get(room_id)
        if not state:
            raise HTTPException(status_code=404, detail="Room not found")
        
        state["chip_balances"][winner] += state["pot"]
        # maybe notify all players about who won by sending a json messgage back to frontend?
        state["game_active"] = False
        state["pot"] = 0
        state["round_count"] = 0
        await self.broadcast(room_id)


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
            #await websocket.receive_text()  # we don't use the message, just keep connection open
            message = await websocket.receive_json()
            action = message.get("action")
            if action == "start_game":
                await manager.start_game(room_id)
            elif action in ["bet", "fold"]:
                amount = message.get("amount", 0)
                await manager.handle_action(room_id, username, action, amount)
    except WebSocketDisconnect:
        manager.disconnect(room_id, username)
        await manager.broadcast(room_id)