import PlayerService from "../service/player.js";
import { Vector2D } from "../utils/types.js";
import Player from "./player.js";
import Room from "./room.js";

// The game loop interval (e.g., 60 FPS)
const GAME_LOOP_INTERVAL = 16; // 16 ms => ~60 updates per second

class GameLoop {
  private player: PlayerService;
  private lastTime: number;

  constructor(player: PlayerService) {
    this.player = player;
    this.lastTime = Date.now();
  }

  // This function will be called continuously at regular intervals
  public startLoop() {
    setInterval(() => {
      this.update();
    }, GAME_LOOP_INTERVAL);
  }

  // Game loop update method
  private update() {
    const deltaTime = 0.16; // Calculate time difference in seconds
    this.lastTime = Date.now(); // Update the lastTime to the current time

    // Update positions of all players in the room
    this.player.getAllPlayers().forEach((player: Player) => {
      // Move each cell of the player
      player.move(deltaTime); // Assume player.move() uses deltaTime for smooth movement
    });

    // Broadcast the updated game state to all clients
    // this.room.updateGameState();
  }
}

export default GameLoop;
