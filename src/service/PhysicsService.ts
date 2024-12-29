import { Cell } from "../core/cell.js";

export class PhysicsService {
  static updateCellPositions(
    cells: Cell[],
    directions: Map<string, { x: number; y: number }>,
    deltaTime: number
  ): void {
    cells.forEach((cell) => {
      const direction = directions.get(cell.id) || { x: 0, y: 0 };
      cell.updatePosition(direction, deltaTime);
    });
  }

  static enforceBoundaries(
    cell: Cell,
    mapSize: { width: number; height: number }
  ): void {
    cell.position.x = Math.max(0, Math.min(mapSize.width, cell.position.x));
    cell.position.y = Math.max(0, Math.min(mapSize.height, cell.position.y));
  }
}
