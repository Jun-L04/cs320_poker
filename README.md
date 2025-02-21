# cs320_poker

## Use Case 1: Creating a Game Room
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




## Use Case 2: Placing a Bet



## Use Case 3: Moving "Turn"



## Use Case 4: Customization of Game Room