import Apple from "../model/apple.js";
import Player from "../model/player.js";
import AppleService from "../service/apple.js";
import PlayerService from "../service/player.js";

export default class GameManager {
  private players: Player[] = [];
  private apples: Apple[] = [];
  private appleService: AppleService;
  private playerService: PlayerService;
  private height = Number(process.env.CANVASHEIGHT) || 1000;
  private width = Number(process.env.CANVASWIDTH) || 1000;

  constructor() {
    this.appleService = new AppleService();
    this.playerService = new PlayerService();
  }

  // Initialize the game
  public initializeGame(): void {
    this.apples = this.appleService.generateInitialApples(
      Number(process.env.MAXAPPLECOUNT)
    );
  }

  public addPlayer(id: string, name: string): Player {
    // Make sure a player with this ID doesn't already exist
    const existingPlayer = this.players.find((p) => p.getId() === id);
    if (existingPlayer) {
      return existingPlayer; // Return the existing player instead of adding a new one
    }

    const color = this.getRandomColor(); // Random color for the player
    const x = Math.random() * this.width; // Random starting position
    const y = Math.random() * this.height;
    const player = new Player(id, name, x, y, color);
    this.players.push(player);
    this.playerService.addPlayer(player);
    return player;
  }
  // Remove a player by ID
  public removePlayer(id: string): void {
    // Remove the player from the `players` array
    this.players = this.players.filter((player) => player.getId() !== id);

    // Remove the player from the `PlayerService`
    this.playerService.removePlayer(id);
  }

  // Update player position
  public updatePlayerPosition(playerId: string, x: number, y: number): void {
    const player = this.players.find((p) => p.getId() === playerId);
    if (player) {
      player.updatePosition(x, y);
      this.checkForAppleCollision(player);
    }
  }

  // Check for collision between player and apples
  private checkForAppleCollision(player: Player): void {
    this.apples.forEach((apple, index) => {
      if (player.isCollidingWithApple(apple)) {
        player.increaseSize(apple); // Increase size based on apple size
        this.apples.splice(index, 1); // Remove the apple from the array
        this.apples.push(this.appleService.createApple()); // Create a new apple
      }
    });
  }

  // Get the game state (players and apples)
  public getGameState(): { players: Player[]; apples: Apple[] } {
    return { players: this.players, apples: this.apples };
  }

  // Random color generator for player
  private getRandomColor(): string {
    const colors = ["blue", "green", "red", "yellow", "purple", "orange"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
