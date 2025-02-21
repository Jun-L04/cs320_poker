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



## Use Case 3: Moving "Turn"



## Use Case 4: Customization of Game Room
