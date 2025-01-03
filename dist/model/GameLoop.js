// The game loop interval (e.g., 60 FPS)
const GAME_LOOP_INTERVAL = 16; // 16 ms => ~60 updates per second
class GameLoop {
    constructor(player) {
        this.player = player;
        this.lastTime = Date.now();
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
        // Update positions of all players in the room
        this.player.getAllPlayers().forEach((player) => {
            // Move each cell of the player
            player.move(deltaTime); // Assume player.move() uses deltaTime for smooth movement
        });
        // Broadcast the updated game state to all clients
        // this.room.updateGameState();
    }
}
export default GameLoop;
//# sourceMappingURL=GameLoop.js.map