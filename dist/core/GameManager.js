import { Room } from "./Room.js";
export class GameManager {
    constructor(mapSize) {
        this.rooms = new Map();
        this.mapSize = mapSize;
        this.directions = new Map(); // Store player directions
    }
    generateRoomId() {
        return `room-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    }
    getRooms() {
        return this.rooms;
    }
    // Add methods to get and set player directions
    getPlayer(playerId) {
        // Search through all rooms to find the player
        for (const room of this.rooms.values()) {
            const player = room.getPlayerById(playerId);
            if (player) {
                return player;
            }
        }
        return undefined; // Player not found
    }
    setPlayerDirection(playerId, direction) {
        // Store direction in directions map
        this.directions.set(playerId, direction);
    }
    addPlayerToRoom(player) {
        const room = Array.from(this.rooms.values()).find((room) => room.canAddPlayer());
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
    removePlayerFromRoom(playerId) {
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
    updateRooms(deltaTime) {
        this.rooms.forEach((room) => room.update(deltaTime));
    }
    getRoomById(roomId) {
        return this.rooms.get(roomId);
    }
    // Broadcast the game state updates for each room
    broadcastRoomStates(io) {
        this.rooms.forEach((room, roomId) => {
            const state = room.gameLoop.getDeltaUpdates();
            io.to(roomId).emit("update", state);
        });
    }
}
//# sourceMappingURL=GameManager.js.map