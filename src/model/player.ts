import { Vector2D } from "../utils/types.js";
import Apple from "./apple.js";
import { Cell } from "./cell.js";

export default class Player {
  private id: string;
  private color: string;
  private name: string; // New name field
  private splitCooldown: number;
  private cells: Map<string, Cell>;
  private target: Vector2D | null = null;

  public getId(): string {
    return this.id;
  }

  public setTarget(newTarget: Vector2D): void {
    this.target = newTarget;
  }
  // public get playerSize(): number {
  //   return this.size;
  // }

  // Getter for the name
  public get playerName(): string {
    return this.name;
  }

  // Public getter for accessing the position of the player
  // public get position(): { x: number; y: number } {
  //   return { x: this.x, y: this.y };
  // }

  // Constructor to initialize the player
  constructor(id: string, name: string, color: string) {
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

  addCell(cell: Cell): void {
    this.cells.set(cell.id, cell);
  }

  removeCell(cellId: string): void {
    this.cells.delete(cellId);
  }
  // Move the player (and its cells) towards the target
  move(deltaTime: number): void {
    if (this.target) {
      // For each cell, update its position
      this.cells.forEach((cell) => {
        cell.updatePosition(this.target, deltaTime);
      });
    }
  }

  public getCells(): Cell[] {
    return Array.from(this.cells.values());
  }

  // Method to retrieve player data
  public getPlayerData() {
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
  public toJSON() {
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
