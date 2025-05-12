# main.py
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from typing import Dict, List

app = FastAPI()


class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, Dict[str, WebSocket]] = (
            {}
        )  # room_id -> {username: WebSocket}
        self.game_states = {}
        self.dealer = 0

    async def connect(
        self, room_id: str, username: str, websocket: WebSocket, new: bool = True
    ):
        await websocket.accept()
        print(self.rooms)
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

    async def start_game(self, room_id: str):
        if room_id not in self.rooms:
            return  # silently ignore if room doesn't exist

        usernames = list(self.rooms[room_id].keys())
        self.game_states = {} if not hasattr(self, "game_states") else self.game_states
        self.game_states[room_id] = {
            "game_active": True,
            "turn_index": self.dealer,
            "players": usernames,
            "chip_balances": {username: 5000 for username in usernames},
            "pot": 0,
        }

        await self.broadcast_custom(
            room_id,
            {
                "type": "game_started",
                "players": usernames,
                "turn": usernames[self.dealer],
                "chip_balances": {username: 5000 for username in usernames},
                "pot": 0,
            },
        )

    async def handle_action(
        self, room_id: str, username: str, action: str, amount: int = 0
    ):
        state = self.game_states.get(room_id)
        if action == "bet":
            if state["chip_balances"][username] < amount:
                return
            state["chip_balances"][username] -= amount
            state["pot"] += amount
            state["turn_index"] = (state["turn_index"] + 1) % len(state["players"])
        elif action == "fold":  # skipping this player's turn
            state["players"].remove(username)  # remove from list
            current_index = state["turn_index"]
            if current_index >= len(state["players"]):
                current_index = 0  # wrap to beginning

            state["turn_index"] = current_index % len(state["players"])
        if len(state["players"]) == 1:  # one player left
            await self.end_round(
                room_id, state["players"][0]
            )  # TODO winner caluclation, this is placeholder

        await self.broadcast_custom(
            room_id,
            {
                "type": "turn_update",
                "turn": state["players"][state["turn_index"]],
                "players": state["players"],
                "pot": state["pot"],
                "chip_balances": state["chip_balances"],
            },
        )

    async def end_round(self, room_id: str, winner):
        state = self.game_states.get(room_id)
        usernames = list(self.rooms[room_id].keys())
        # Give the pot to the winner
        if winner in state["chip_balances"]:
            state["chip_balances"][winner] += state["pot"]

        self.dealer = (self.dealer + 1) % len(usernames)

        # End the game
        self.game_states[room_id]["turn_index"] = self.dealer
        self.game_states[room_id]["players"] = usernames
        self.game_states[room_id]["pot"] = 0

        await self.broadcast_custom(
            room_id,
            {
                "type": "round_over",
                "winner": winner,
                "chip_balances": state["chip_balances"],
                "turn": self.dealer,
                "players": usernames,
            },
        )

    async def broadcast(self, room_id: str):
        usernames = list(self.rooms.get(room_id, {}).keys())
        for ws in self.rooms.get(room_id, {}).values():
            await ws.send_json({"type": "update_players", "players": usernames})

    async def broadcast_custom(self, room_id: str, message: Dict):
        print(self.game_states)
        for ws in self.rooms.get(room_id, {}).values():
            await ws.send_json(message)


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
            message = (
                await websocket.receive_json()
            )  # we don't use the message, just keep connection open
            action = message["action"]
            amount = message.get("amount", 0)
            print(message)
            print(action)
            print(amount)
            if action == "start_game":
                await manager.start_game(room_id)
            if action == "bet":
                await manager.handle_action(room_id, username, action, amount)
            if action == "fold":
                await manager.handle_action(room_id, username, action)
    except WebSocketDisconnect:
        manager.disconnect(room_id, username)
        await manager.broadcast(room_id)
