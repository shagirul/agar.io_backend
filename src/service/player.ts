import Player from "../model/player.js";

export default class PlayerService {
  private players: Map<string, Player> = new Map();

  // Method to get a player by ID
  public getPlayerById(id: string): Player | undefined {
    return this.players.get(id);
  }

  // Method to add a player
  public addPlayer(player: Player): void {
    this.players.set(player.getId(), player);
  }

  // Method to update a player's position
  public updatePlayerPosition(id: string, x: number, y: number): void {
    const player = this.players.get(id);
    if (player) {
      player.updatePosition(x, y);
    }
  }

  // Method to get all players
  public getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  // Method to remove a player (optional if needed)
  public removePlayer(id: string): void {
    this.players.delete(id);
  }
}
