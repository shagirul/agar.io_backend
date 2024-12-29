import { CollisionService } from "../service/CollisionService.js";
import { PhysicsService } from "../service/PhysicsService.js";
import { mapToObject } from "../utility/MaptoObject.js";
import { Food } from "./food.js";
export class GameLoop {
    constructor(mapSize) {
        this.directions = new Map();
        this.players = new Map();
        this.food = new Map();
        this.mapSize = mapSize;
        this.spawnFood(100); // Spawn initial 100 food items
    }
    addPlayer(player) {
        this.players.set(player.id, player);
    }
    getPlayer(playerId) {
        return this.players.get(playerId);
    }
    removePlayer(playerId) {
        this.players.delete(playerId);
    }
    spawnFood(count) {
        for (let i = 0; i < count; i++) {
            const id = `food-${Date.now()}-${i}`;
            const position = {
                x: Math.random() * this.mapSize.width,
                y: Math.random() * this.mapSize.height,
            };
            this.food.set(id, new Food(id, position));
        }
    }
    //   update(deltaTime: number): void {
    //     this.players.forEach((player) => {
    //       player.cells.forEach((cell: Cell) => {
    //         // Example: Move cells towards a direction (placeholder direction for now)
    //         const direction = { x: Math.random() - 0.5, y: Math.random() - 0.5 };
    //         cell.updatePosition(direction, deltaTime);
    //       });
    //     });
    //     // Collision detection and food consumption (to be implemented in Phase 2)
    //   }
    update(deltaTime) {
        // Convert Map to Object (for directions)
        // const directionObject = mapToObject(this.directions);
        const directionObject = mapToObject(this.directions);
        // Handle player cell splitting
        this.players.forEach((player) => {
            if (player.wantsToSplit()) {
                player.splitCells(directionObject); // Pass the converted object for directions
            }
        });
        // Movement and boundary checks
        this.players.forEach((player) => {
            player.cells.forEach((cell) => {
                // Update cell positions
                PhysicsService.updateCellPositions([cell], this.directions, deltaTime);
                // Enforce boundaries
                PhysicsService.enforceBoundaries(cell, this.mapSize);
            });
        });
        // Handle food collisions
        this.food.forEach((food, foodId) => {
            this.players.forEach((player) => {
                player.cells.forEach((cell) => {
                    if (CollisionService.handleCellFoodCollision(cell, food)) {
                        this.food.delete(foodId); // Remove consumed food
                    }
                });
            });
        });
        // Handle cell-cell collisions and merging
        this.players.forEach((player1) => {
            player1.cells.forEach((cell1) => {
                this.players.forEach((player2) => {
                    player2.cells.forEach((cell2) => {
                        if (player1 !== player2 || cell1 !== cell2) {
                            if (CollisionService.handleCellCellCollision(cell1, cell2)) {
                                if (cell1.size > cell2.size) {
                                    player2.removeCell(cell2.id); // Cell consumed
                                    cell1.size += cell2.size; // Increase size of consuming cell
                                }
                                else {
                                    player1.removeCell(cell1.id); // Cell consumed
                                    cell2.size += cell1.size; // Increase size of consuming cell
                                }
                            }
                        }
                    });
                });
            });
        });
        // Handle merge logic for each cell
        this.players.forEach((player) => {
            player.cells.forEach((cell) => {
                if (cell.canMerge()) {
                    player.mergeCells(cell); // Player-specific merge logic
                }
            });
        });
    }
    setPlayerDirection(playerId, direction) {
        this.directions.set(playerId, direction);
    }
    getDeltaUpdates() {
        const players = [];
        this.players.forEach((player) => {
            players.push({
                id: player.id,
                cells: Array.from(player.cells.values()).map((cell) => ({
                    id: cell.id,
                    position: cell.position,
                    size: cell.size,
                })),
            });
        });
        const food = Array.from(this.food.values()).map((f) => ({
            id: f.id,
            position: f.position,
        }));
        return { players, food };
    }
}
//# sourceMappingURL=gameloop.js.map