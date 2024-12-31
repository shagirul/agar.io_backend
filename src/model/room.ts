import Apple from "./apple.js";
import { Cell } from "./cell.js";
import Player from "./player.js";
import AppleService from "../service/apple.js";
import PlayerService from "../service/player.js";
import { PlayerData, Vector2D } from "../utils/types.js";
import GameLoop from "./GameLoop.js";

export default class Room {
  private players: Player[] = [];
  private apples: Apple[] = [];
  private appleService: AppleService;
  private playerService: PlayerService;
  private height = Number(process.env.CANVASHEIGHT) || 1000;
  private width = Number(process.env.CANVASWIDTH) || 1000;
  private gameLoop: GameLoop;

  constructor() {
    this.appleService = new AppleService();
    this.playerService = new PlayerService();
    this.gameLoop = new GameLoop(this.playerService);
  }

  // Initialize the game
  public initializeGame(): void {
    this.apples = this.appleService.generateInitialApples(
      Number(process.env.MAXAPPLECOUNT)
    );
    // Initialize GameLoop here
    this.gameLoop = new GameLoop(this.playerService);
    this.gameLoop.startLoop(); // Start the game loop
  }

  public addPlayer(id: string, name: string): Player {
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
  public removePlayer(id: string): void {
    // Remove the player from the players array
    this.players = this.players.filter((player) => player.getId() !== id);

    // Remove the player from PlayerService
    this.playerService.removePlayer(id);
  }

  // Update player position
  public updatePlayerPosition(
    playerId: string,
    direction: Vector2D,
    deltaTime: number
  ): void {
    const player = this.playerService.getPlayerById(playerId);
    if (!player) return;

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
  private checkForAppleCollision(cell: Cell): void {
    this.apples.forEach((apple, index) => {
      if (cell.isCollidingWithApple(apple)) {
        cell.updateSize(cell.size + apple.appleSize);
        this.apples.splice(index, 1); // Remove the apple
        this.apples.push(this.appleService.createApple()); // Add a new apple
      }
    });
  }

  // Get the game state (players and apples)
  public getGameState(): { players: PlayerData[]; apples: Apple[] } {
    const players = this.players.map((player) => player.toJSON());
    return { players: players, apples: this.apples };
  }

  // Random color generator for player
  private getRandomColor(): string {
    const colors = ["blue", "green", "red", "yellow", "purple", "orange"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
