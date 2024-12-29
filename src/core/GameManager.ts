import { Server } from "socket.io";
import { Player } from "./player.js";
import { Room } from "./Room.js";

export class GameManager {
  private rooms: Map<string, Room>;
  private mapSize: { width: number; height: number };
  private directions: Map<string, { x: number; y: number }>;

  constructor(mapSize: { width: number; height: number }) {
    this.rooms = new Map();
    this.mapSize = mapSize;
    this.directions = new Map(); // Store player directions
  }

  private generateRoomId(): string {
    return `room-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  public getRooms(): Map<string, Room> {
    return this.rooms;
  }

  // Add methods to get and set player directions
  public getPlayer(playerId: string): Player | undefined {
    // Search through all rooms to find the player
    for (const room of this.rooms.values()) {
      const player = room.getPlayerById(playerId);
      if (player) {
        return player;
      }
    }
    return undefined; // Player not found
  }

  public setPlayerDirection(
    playerId: string,
    direction: { x: number; y: number }
  ): void {
    // Store direction in directions map
    this.directions.set(playerId, direction);
  }

  addPlayerToRoom(player: Player): string {
    const room = Array.from(this.rooms.values()).find((room) =>
      room.canAddPlayer()
    );

    if (!room) {
      const newRoomId = this.generateRoomId();
      const newRoom = new Room(newRoomId, this.mapSize);
      newRoom.addPlayer(player);
      this.rooms.set(newRoomId, newRoom);
      return newRoomId;
    }

    room.addPlayer(player);
    return room.getId();
  }

  removePlayerFromRoom(playerId: string): void {
    for (const [roomId, room] of this.rooms) {
      if (room.players.has(playerId)) {
        room.removePlayer(playerId);

        // Remove empty rooms
        if (room.players.size === 0) {
          this.rooms.delete(roomId);
        }
        return;
      }
    }
  }

  updateRooms(deltaTime: number): void {
    this.rooms.forEach((room) => room.update(deltaTime));
  }

  getRoomById(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  // Broadcast the game state updates for each room
  public broadcastRoomStates(io: Server): void {
    this.rooms.forEach((room, roomId) => {
      const state = room.gameLoop.getDeltaUpdates();
      io.to(roomId).emit("update", state);
    });
  }
}
