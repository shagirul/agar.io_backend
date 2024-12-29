export class PhysicsService {
    static updateCellPositions(cells, directions, deltaTime) {
        cells.forEach((cell) => {
            const direction = directions.get(cell.id) || { x: 0, y: 0 };
            cell.updatePosition(direction, deltaTime);
        });
    }
    static enforceBoundaries(cell, mapSize) {
        cell.position.x = Math.max(0, Math.min(mapSize.width, cell.position.x));
        cell.position.y = Math.max(0, Math.min(mapSize.height, cell.position.y));
    }
}
//# sourceMappingURL=PhysicsService.js.map