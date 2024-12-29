// import { Cell } from "./cell.js";

import { Cell } from "./cell.js";

export class Player {
  id: string;
  name: string;
  cells: Map<string, Cell>; // Store cells in a Map for easy lookup by ID
  splitCooldown: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.cells = new Map();

    // Initialize with one cell
    this.addCell(new Cell(`${id}-1`, { x: 100, y: 100 }, 20, id));
    this.splitCooldown = 0;
  }

  // Add a new cell to the player
  addCell(cell: Cell): void {
    this.cells.set(cell.id, cell);
  }

  // Remove a cell by its ID
  removeCell(cellId: string): void {
    this.cells.delete(cellId);
  }

  // Check if the player wants to split
  wantsToSplit(): boolean {
    return this.splitCooldown <= 0;
  }

  // Split player cells
  splitCells(directions: { [cellId: string]: { x: number; y: number } }): void {
    const newCells: Cell[] = [];
    this.cells.forEach((cell) => {
      if (cell.size > 20) {
        const direction = directions[cell.id];
        if (direction) {
          const splitSize = cell.size / 2;

          // Create a new cell with the new position and split size
          const newCell = new Cell(
            `${this.id}-${Math.random().toString(36).substring(2, 8)}`,
            {
              x: cell.position.x + direction.x * 10,
              y: cell.position.y + direction.y * 10,
            }, // Use `position` object
            splitSize,
            this.id // Set owner as the player's ID
          );

          cell.size = splitSize; // Reduce the size of the original cell
          newCells.push(newCell);
        }
      }
    });

    // Add new cells to the player
    newCells.forEach((cell) => this.addCell(cell));

    // Reset split cooldown
    this.splitCooldown = 30; // Example cooldown (adjust as needed)
  }

  // Merge cells
  mergeCells(targetCell: Cell): void {
    const mergeableCells = Array.from(this.cells.values()).filter((cell) => {
      return cell !== targetCell && cell.canMerge();
    });

    mergeableCells.forEach((cell) => {
      targetCell.size += cell.size; // Combine sizes
      this.removeCell(cell.id); // Remove merged cell
    });
  }
}
