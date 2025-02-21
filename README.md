# cs320_poker

## Use Case 1: Creating a Game Room



## Use Case 2: Placing a Bet



## Use Case 3: Moving "Turn"

### **Goal**  
The turn moves to the next player after each turn, depending on a set order (clockwise, counter-clockwise, or a custom order).  

## **Primary Actor**  
- System moving the turn based on who’s playing  

## **Secondary Actors**  
- The players  

## **Precondition**  
- The turn order is defined before the game starts.  
- Players are connected to the game server.  

## **Success End Condition**  
- The turn moves correctly to the next player after a player completes their action.  

## **Failure End Condition**  
- The turn does not change.  
- The turn moves to the wrong player (as per the predefined order).  

## **Trigger**  
- A player clicks the "Finish Turn" button.  

## **Main Success Scenario**  
1. **Player Action:** The player makes a bet, folds, or takes any valid action in the poker game.  
2. **Turn End Request:** The player clicks "Finish Turn" after completing their action.  
3. **System Recognition:** The system recognizes that it is time to change to the next player.  
4. **Player Verification:** The system checks if the next player is still connected to the server.  
5. **Turn Switching:**  
   - **If the player is connected,** the system switches control to that player.  
   - **If the player is disconnected,** the system moves to the next available player in the predefined order.  

## **Error Scenarios & Solutions**  
### **1. Player Exits During Their Turn**  
- **Issue:** The player leaves the game while making a bet and never clicks "Finish Turn."  
- **Solution:** Implement automatic turn switching in case of a disconnect.  

### **2. Server Timeout or Incorrect Turn Switching**  
- **Issue:** The player clicks "Finish Turn," but the server times out or switches to the wrong player.  
- **Solution:** Cache the game state so that when the server comes back, progress is restored to the last known correct state.  


## Use Case 4: Customization of Game Room
