import { Food } from "./food.js";
import { GameLoop } from "./gameloop.js";
import { Player } from "./player.js";

export class Room {
  id: string;
  players: Map<string, Player>;
  food: Map<string, Food>;
  gameLoop: GameLoop;
  maxPlayers: number;

  constructor(id: string, mapSize: { width: number; height: number }) {
    this.id = id;
    this.players = new Map();
    this.food = new Map();
    this.gameLoop = new GameLoop(mapSize);
    this.maxPlayers = 20;
  }
  getId() {
    return this.id;
  }
  public canAddPlayer(): boolean {
    return this.players.size < this.maxPlayers;
  }
  addPlayer(player: Player): boolean {
    if (this.players.size >= 20) return false; // Max player limit
    this.players.set(player.id, player);
    this.gameLoop.addPlayer(player);
    return true;
  }
  getPlayerById(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  removePlayer(playerId: string): void {
    this.players.delete(playerId);
    this.gameLoop.removePlayer(playerId);
  }

  update(deltaTime: number): void {
    this.gameLoop.update(deltaTime);
  }

  getDeltaUpdates(): any {
    return this.gameLoop.getDeltaUpdates();
  }
}
