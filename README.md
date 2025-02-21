# cs320_poker

## Use Case 1: Creating a Game Room
#### Goal
A player creates a room and a unique code gets generated. Other players can use the code to join the room.
#### Primary Actor
The player creating the room.
#### Secondary Actors
The system and other players.
#### Precondition
The max number of rooms is not exceeded and server can make a new room.
#### Success end condition
A unique room is created and accessible to other players
#### Failure end condition
A unique room is not created or not accessible
#### Trigger
Player clicks the create room button.
#### Main success scenario
1. Player navigates to the create room page
2. Server generates a unique room code 
3. Server shows the code to the player
4. Payer shares the code with the other players
5. Players use the code to join the room
6. Server verifies the code and grants access
#### Variations (error scenarios)
2a. Server exceeds the max number of active rooms (doesn’t generate code)
5a. Players use the wrong code to join the room
#### Variations (alternative scenarios)
1a. Player does not finish the steps to creating a room


## Use Case 2: Placing a Bet
#### Description: 
A player places a bet in the virtual poker game. The server verifies the player’s chip balance and places the bet, then updates the player’s chip balance. This is visible to all players in the game.
#### Actors: 
Primary actor is the player and the secondary actor is the server hosting the game room
#### Goal
Player places a bet and the server recognizes this by correctly updating the player’s chip balance and broadcasting this to all other players
#### Preconditions
The player is in a game, the game has started, it is the player’s turn, and the player has a positive chip balance
#### Postconditions
On success: the bet is placed and the chip balance is updated, other players can also see this change
On failure: the bet could not be placed, the balance is not updated
#### Exceptions
1. Player does not have sufficient chips to place a bet
2. Player exits the game room before placing a bet
3. The host terminates and everyone disconnects
#### Trigger
Player specifies a chip amount and places that amount down as bet
####  Main success scenario 
1. Player joins a game room
2. Player receives some chips as balance
3. Player specifies an amount to bet
4. Server verifies player has enough chip to place this bet
5. Server updates player’s chip balance
6. Server broadcasts this update to all other players
####  Error scenario
1. Player places a bet when they have insufficient chips, server recognizes this and stop the player from placing invalid bets
2. Player loses internet connection. Server tries to reconnect them
3. Host terminates before the players can place their bet. Server attempts to reconnect everyone and starts a new game with a new host



## Use Case 3: Moving "Turn"

### **Goal**  
The turn moves to the next player after each turn, depending on a set order (clockwise, counter-clockwise, or a custom order).  

### **Primary Actor**  
- System moving the turn based on who’s playing  

### **Secondary Actors**  
- The players  

### **Precondition**  
- The turn order is defined before the game starts.  
- Players are connected to the game server.  

### **Success End Condition**  
- The turn moves correctly to the next player after a player completes their action.  

### **Failure End Condition**  
- The turn does not change.  
- The turn moves to the wrong player (as per the predefined order).  

### **Trigger**  
- A player clicks the "Finish Turn" button.  

### **Main Success Scenario**  
1. **Player Action:** The player makes a bet, folds, or takes any valid action in the poker game.  
2. **Turn End Request:** The player clicks "Finish Turn" after completing their action.  
3. **System Recognition:** The system recognizes that it is time to change to the next player.  
4. **Player Verification:** The system checks if the next player is still connected to the server.  
5. **Turn Switching:**  
   - **If the player is connected,** the system switches control to that player.  
   - **If the player is disconnected,** the system moves to the next available player in the predefined order.  

### **Error Scenarios & Solutions**  
1. Player Exits During Their Turn**  
- **Issue:** The player leaves the game while making a bet and never clicks "Finish Turn."  
- **Solution:** Implement automatic turn switching in case of a disconnect.  

2. Server Timeout or Incorrect Turn Switching**  
- **Issue:** The player clicks "Finish Turn," but the server times out or switches to the wrong player.  
- **Solution:** Cache the game state so that when the server comes back, progress is restored to the last known correct state.  


## Use Case 4: Customization of Game Room
