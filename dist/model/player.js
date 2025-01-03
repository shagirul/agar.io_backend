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
            const cellArray = Array.from(this.cells.values());
            // Update positions of all cells
            cellArray.forEach((cell) => {
                cell.updatePosition(this.target, deltaTime);
            });
            // Check for merging or repositioning conditions
            for (let i = 0; i < cellArray.length; i++) {
                for (let j = i + 1; j < cellArray.length; j++) {
                    const cellA = cellArray[i];
                    const cellB = cellArray[j];
                    const dx = cellB.position.x - cellA.position.x;
                    const dy = cellB.position.y - cellA.position.y;
                    const distance = Math.sqrt(dx ** 2 + dy ** 2);
                    // Calculate the distance threshold (sum of radii of both cells)
                    const mergeDistance = (cellA.size + cellB.size) / 2;
                    // If cells can merge and are close enough, merge them
                    if (distance < mergeDistance &&
                        cellA.canMerge() &&
                        cellB.canMerge()) {
                        // Merge cells if eligible
                        const newSize = Math.sqrt(cellA.size ** 2 + cellB.size ** 2); // Preserve area
                        cellA.updateSize(newSize);
                        cellA.lastMergeTime = Date.now(); // Update merge timestamp
                        this.cells.delete(cellB.id); // Remove merged cell
                    }
                    else if (distance < (cellA.size + cellB.size) / 2) {
                        // Prevent overlap by adjusting position only if distance is too close
                        const overlap = (cellA.size + cellB.size) / 2 - distance;
                        const correction = overlap / 2;
                        // Normalize direction vector to separate the cells
                        const direction = { x: dx / distance, y: dy / distance };
                        // Push cellA and cellB apart by the correction distance
                        cellA.position.x -= direction.x * correction;
                        cellA.position.y -= direction.y * correction;
                        cellB.position.x += direction.x * correction;
                        cellB.position.y += direction.y * correction;
                    }
                }
            }
        }
    }
    shoot() {
        if (!this.target)
            return;
        const newCells = [];
        this.cells.forEach((cell) => {
            if (cell.size > 20) {
                const newSize = cell.size / 2;
                cell.updateSize(newSize);
                const direction = {
                    x: this.target.x - cell.position.x,
                    y: this.target.y - cell.position.y,
                };
                const distance = Math.sqrt(direction.x ** 2 + direction.y ** 2);
                if (distance === 0)
                    return;
                const normalized = {
                    x: direction.x / distance,
                    y: direction.y / distance,
                };
                const newCellPosition = {
                    x: cell.position.x + normalized.x * 100,
                    y: cell.position.y + normalized.y * 100,
                };
                const newCell = new Cell(`${this.id}-${Math.random().toString(36).substr(2, 9)}`, newCellPosition, newSize, this.id);
                // Adjust cooldown dynamically
                newCell.splitCooldown = 30000 + (7 / 300) * newCell.size * 1000;
                newCells.push(newCell);
                cell.position.x -= normalized.x * 100;
                cell.position.y -= normalized.y * 100;
            }
        });
        newCells.forEach((newCell) => this.addCell(newCell));
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
            cells: this.getCells().map((cell) => ({
                id: cell.id,
                position: cell.getPosition(), // Assuming Cell class has getPosition method
                size: cell.size, // Assuming Cell class has size property
            })), // Map the cells to a serializable format
        };
    }
}
//# sourceMappingURL=player.js.map