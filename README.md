# Battleship Game

A game written in JavaScript. Play it at: https://cravvley.github.io/Battleship-game/

## How to Play

### Setup Phase

1. **Place your ships** — click on your board (right) to place 5 ships. Ship sizes: 5, 4, 3, 3, 2 cells (in that order).
2. **Change direction** — press **R** to switch between vertical and horizontal placement.
3. **Valid placement** — ships cannot touch each other (including diagonally). Green cells show where your ship will be placed when you hover.
4. Once all 5 ships are placed, the game starts automatically.

### Battle Phase

1. **Your turn** — click a cell on the **AI board** (left) to shoot.
2. **Hit** — red cell with 💥 means you hit an enemy ship.
3. **Miss** — gray cell with × means you missed.
4. **AI turn** — after each of your shots, the AI shoots at your board automatically.

### Winning

- **You win** — when all AI ships are destroyed (all 5 ships sunk).
- **You lose** — when all your ships are destroyed.
- Click **Play again** to start a new game.

### Board Layout

- **12×12 grid** with coordinates (A–L for columns, 1–12 for rows).
- **5 ships** (classic Battleship fleet): 1×5, 1×4, 2×3, 1×2 cells.
- Ships are placed randomly on the AI board at the start.
