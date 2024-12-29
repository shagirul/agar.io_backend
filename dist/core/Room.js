import { GameLoop } from "./gameloop.js";
export class Room {
    constructor(id, mapSize) {
        this.id = id;
        this.players = new Map();
        this.food = new Map();
        this.gameLoop = new GameLoop(mapSize);
        this.maxPlayers = 20;
    }
    getId() {
        return this.id;
    }
    canAddPlayer() {
        return this.players.size < this.maxPlayers;
    }
    addPlayer(player) {
        if (this.players.size >= 20)
            return false; // Max player limit
        this.players.set(player.id, player);
        this.gameLoop.addPlayer(player);
        return true;
    }
    getPlayerById(playerId) {
        return this.players.get(playerId);
    }
    removePlayer(playerId) {
        this.players.delete(playerId);
        this.gameLoop.removePlayer(playerId);
    }
    update(deltaTime) {
        this.gameLoop.update(deltaTime);
    }
    getDeltaUpdates() {
        return this.gameLoop.getDeltaUpdates();
    }
}
//# sourceMappingURL=Room.js.map