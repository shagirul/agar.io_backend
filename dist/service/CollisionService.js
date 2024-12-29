export class CollisionService {
    static isColliding(entity1, entity2) {
        const distance = Math.sqrt((entity1.position.x - entity2.position.x) ** 2 +
            (entity1.position.y - entity2.position.y) ** 2);
        return distance < (entity1.size + entity2.size) / 2;
    }
    static handleCellFoodCollision(cell, food) {
        if (this.isColliding(cell, food)) {
            cell.size += food.size; // Increase cell size
            return true; // Food consumed
        }
        return false;
    }
    static handleCellCellCollision(cell1, cell2) {
        if (this.isColliding(cell1, cell2) && cell1.size > cell2.size * 1.1) {
            cell1.size += cell2.size; // Larger cell consumes smaller
            return true; // Smaller cell consumed
        }
        return false;
    }
}
//# sourceMappingURL=CollisionService.js.map