import Player from "./player.js";
import AppleService from "../service/apple.js";
import PlayerService from "../service/player.js";
import GameLoop from "./GameLoop.js";
export default class Room {
    constructor() {
        this.players = [];
        this.apples = [];
        this.height = Number(process.env.CANVASHEIGHT) || 1000;
        this.width = Number(process.env.CANVASWIDTH) || 1000;
        this.appleService = new AppleService();
        this.playerService = new PlayerService();
        this.gameLoop = new GameLoop(this.playerService);
    }
    // Initialize the game
    initializeGame() {
        this.apples = this.appleService.generateInitialApples(Number(process.env.MAXAPPLECOUNT));
        // Initialize GameLoop here
        this.gameLoop = new GameLoop(this.playerService);
        this.gameLoop.startLoop(); // Start the game loop
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
    // Remove a player by ID
    removePlayer(id) {
        // Remove the player from the players array
        this.players = this.players.filter((player) => player.getId() !== id);
        // Remove the player from PlayerService
        this.playerService.removePlayer(id);
    }
    // Update player position
    updatePlayerPosition(playerId, direction, deltaTime) {
        const player = this.playerService.getPlayerById(playerId);
        if (!player)
            return;
        // Set the new target direction for the player
        player.setTarget(direction);
        // Move the player (and cells) towards the target
        player.move(deltaTime);
        // Handle collision with apples
        player.getCells().forEach((cell) => {
            this.checkForAppleCollision(cell);
        });
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