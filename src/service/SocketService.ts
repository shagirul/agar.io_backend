import { Server, Socket } from "socket.io";
import { GameManager } from "../core/GameManager.js";
import { Player } from "../core/player.js";

export class SocketService {
  private io: Server;
  private gameManager: GameManager;

  constructor(io: Server, gameManager: GameManager) {
    this.io = io;
    this.gameManager = gameManager;
  }

  initialize(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Player connected: ${socket.id}`);

      socket.on("join", (playerName: string) => {
        const player = new Player(socket.id, playerName);
        const roomId = this.gameManager.addPlayerToRoom(player);

        socket.join(roomId);
        this.io.to(socket.id).emit("joined", {
          id: player.id,
          roomId,
          mapSize: this.gameManager.getRoomById(roomId)?.gameLoop.mapSize,
        });
        console.log(`Player ${playerName} joined room ${roomId}`);
      });

      socket.on("move", (direction: { x: number; y: number }) => {
        const playerRooms = [
          ...this.io.sockets.adapter.sids.get(socket.id)!,
        ].filter((room) => room.startsWith("room-"));
        const roomId = playerRooms[0];

        const room = this.gameManager.getRoomById(roomId);
        if (room) {
          room.gameLoop.setPlayerDirection(socket.id, direction);
        }
      });

      socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        this.gameManager.removePlayerFromRoom(socket.id);
      });
    });
  }

  broadcastRoomStates(): void {
    const rooms = this.gameManager.getRooms();
    rooms.forEach((room, roomId) => {
      const delta = room.getDeltaUpdates();
      this.io.to(roomId).emit("gameState", delta);
    });
  }
}
