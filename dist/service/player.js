export default class PlayerService {
    constructor() {
        this.players = new Map();
    }
    // Method to get a player by ID
    getPlayerById(id) {
        return this.players.get(id);
    }
    // Method to add a player
    addPlayer(player) {
        this.players.set(player.getId(), player);
    }
    // Method to update a player's position
    updatePlayerPosition(id, deltaTime) {
        const player = this.players.get(id);
        if (player) {
            player.move(deltaTime);
        }
    }
    // Method to get all players
    getAllPlayers() {
        return Array.from(this.players.values());
    }
    // Method to remove a player (optional if needed)
    removePlayer(id) {
        this.players.delete(id);
        console.log("player deleted", id);
    }
}
//# sourceMappingURL=player.js.map