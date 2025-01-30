import Player from "./player.js";
import AppleService from "../service/apple.js";
import PlayerService from "../service/player.js";
const GAME_LOOP_INTERVAL = 16;
export default class Room {
    constructor() {
        this.players = [];
        this.apples = [];
        this.height = Number(process.env.CANVASHEIGHT) || 1000;
        this.width = Number(process.env.CANVASWIDTH) || 1000;
        this.appleService = new AppleService();
        this.playerService = new PlayerService();
        // this.gameLoop = new GameLoop(this.playerService);
        this.lastTime = Date.now();
        this.startLoop();
    }
    // Initialize the game
    initializeGame() {
        this.apples = this.appleService.generateInitialApples(Number(process.env.MAXAPPLECOUNT));
    }
    // This function will be called continuously at regular intervals
    startLoop() {
        setInterval(() => {
            this.update();
        }, GAME_LOOP_INTERVAL);
    }
    // Game loop update method
    update() {
        const deltaTime = (Date.now() - this.lastTime) / 1000; // Calculate time difference in seconds
        this.lastTime = Date.now(); // Update the lastTime to the current time
        // // Update positions of all players in the room
        // this.playerService.getAllPlayers().forEach((player: Player) => {
        //   // Move each cell of the player
        //   player.move(deltaTime); // Assume player.move() uses deltaTime for smooth movement
        //   player.getCells().forEach((cell) => {
        //     this.checkForAppleCollision(cell);
        //   });
        // });
        // Update positions of all players in the room
        this.playerService.getAllPlayers().forEach((player) => {
            // Move each cell of the player
            player.move(deltaTime); // Assume player.move() uses deltaTime for smooth movement
            player.getCells().forEach((cell) => {
                // Check for collisions with apples
                this.checkForAppleCollision(cell);
                // Check for collisions with other players' cells
                this.players.forEach((otherPlayer) => {
                    if (player !== otherPlayer) {
                        otherPlayer.getCells().forEach((otherCell) => {
                            if (this.checkCollision(cell, otherCell)) {
                                this.handleCollision(player, cell, otherPlayer, otherCell);
                            }
                        });
                    }
                });
            });
        });
        // Broadcast the updated game state to all clients
    }
    addPlayer(id, name) {
        // Check if a player with this ID already exists
        const existingPlayer = this.playerService.getPlayerById(id);
        if (existingPlayer) {
            return existingPlayer; // Return the existing player if it exists
        }
        // Generate a random color for the player
        const color = this.getRandomColor();
        // Create the player with an initial random position and the generated color
        const player = new Player(id, name, color);
        // Add the player to the list of players
        this.players.push(player);
        // Use the player service to add the player
        this.playerService.addPlayer(player);
        return player;
    }
    absorbCell(
    // winnerPlayer: Player,
    winnerCell, loserPlayer, loserCellId) {
        const loserCell = loserPlayer.getCellById(loserCellId);
        // if (!loserCell) return;
        if (!loserCell) {
            console.warn(`Cell with ID ${loserCellId} not found for player ${loserPlayer.getId()}`);
            return;
        }
        // Increase the winner's cell size
        winnerCell.size += loserCell.size * 0.8;
        // Remove the eaten cell
        loserPlayer.removeCell(loserCellId);
        // Remove the player if they have no more cells
        if (loserPlayer.getCells().length === 0) {
            this.removePlayer(loserPlayer.getId());
        }
    }
    checkCollision(cellA, cellB) {
        const dx = cellA.position.x - cellB.position.x;
        const dy = cellA.position.y - cellB.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (cellA.size + cellB.size) / 2;
    }
    handleCollision(playerA, cellA, playerB, cellB) {
        if (cellA.size > cellB.size * 1.1) {
            // Slight tolerance for fair collisions
            this.absorbCell(cellA, playerB, cellB.id);
        }
        else if (cellB.size > cellA.size * 1.1) {
            this.absorbCell(cellB, playerA, cellA.id);
        }
    }
    // Remove a player by ID
    removePlayer(id) {
        // Remove the player from the players array
        this.players = this.players.filter((player) => player.getId() !== id);
        // Remove the player from PlayerService
        this.playerService.removePlayer(id);
    }
    attack(id) {
        console.log("player splitted", id);
        // Remove the player from the players array
        // Remove the player from PlayerService
        this.playerService.shoot(id);
    }
    // Update player position
    updatePlayerPosition(playerId, direction) {
        const player = this.playerService.getPlayerById(playerId);
        if (!player)
            return;
        player.setTarget(direction);
    }
    // Check for collision between player and apples
    checkForAppleCollision(cell) {
        this.apples.forEach((apple, index) => {
            if (cell.isCollidingWithApple(apple)) {
                cell.updateSize(cell.size + apple.appleSize);
                this.apples.splice(index, 1); // Remove the apple
                this.apples.push(this.appleService.createApple()); // Add a new apple
            }
        });
    }
    // Get the game state (players and apples)
    getGameState() {
        const players = this.players.map((player) => player.toJSON());
        return { players: players, apples: this.apples };
    }
    // Random color generator for player
    getRandomColor() {
        const colors = ["blue", "green", "red", "yellow", "purple", "orange"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
//# sourceMappingURL=room.js.map