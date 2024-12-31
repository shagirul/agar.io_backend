import { Cell } from "./cell.js";
export default class Player {
    getId() {
        return this.id;
    }
    setTarget(newTarget) {
        this.target = newTarget;
    }
    // public get playerSize(): number {
    //   return this.size;
    // }
    // Getter for the name
    get playerName() {
        return this.name;
    }
    // Public getter for accessing the position of the player
    // public get position(): { x: number; y: number } {
    //   return { x: this.x, y: this.y };
    // }
    // Constructor to initialize the player
    constructor(id, name, color) {
        this.target = null;
        this.id = id;
        this.name = name;
        this.color = color;
        this.splitCooldown = 0;
        this.cells = new Map();
        const randomPosition = {
            x: Math.random() * Number(process.env.CANVASWIDTH || 1000),
            y: Math.random() * Number(process.env.CANVASHEIGHT || 1000),
        };
        const cell = new Cell(`${id}-1`, randomPosition, 30, id);
        this.addCell(cell);
    }
    addCell(cell) {
        this.cells.set(cell.id, cell);
    }
    removeCell(cellId) {
        this.cells.delete(cellId);
    }
    // Move the player (and its cells) towards the target
    move(deltaTime) {
        if (this.target) {
            // For each cell, update its position
            this.cells.forEach((cell) => {
                cell.updatePosition(this.target, deltaTime);
            });
        }
    }
    getCells() {
        return Array.from(this.cells.values());
    }
    // Method to retrieve player data
    getPlayerData() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            splitCooldown: this.splitCooldown,
            cells: this.getCells().map((cell) => ({
                id: cell.id,
                position: cell.position,
                size: cell.size,
            })), // Return an array of plain objects representing the cells
        };
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            splitCooldown: this.splitCooldown,
            cells: this.getCells().map((cell) => ({
                id: cell.id,
                position: cell.getPosition(), // Assuming Cell class has getPosition method
                size: cell.size, // Assuming Cell class has size property
            })), // Map the cells to a serializable format
        };
    }
}
//# sourceMappingURL=player.js.map