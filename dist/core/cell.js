export class Cell {
    constructor(id, position, size, owner) {
        this.id = id;
        this.position = position;
        this.size = size;
        this.speed = this.calculateSpeed();
        this.owner = owner;
        this.lastMergeTime = Date.now();
    }
    calculateSpeed() {
        // Speed decreases with size
        return Math.max(5, 50 / Math.sqrt(this.size));
    }
    canMerge() {
        const cooldown = 30000 + (7 / 300) * this.size * 1000;
        return Date.now() - this.lastMergeTime > cooldown;
    }
    updatePosition(direction, deltaTime) {
        const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        if (magnitude === 0)
            return;
        const normalized = {
            x: direction.x / magnitude,
            y: direction.y / magnitude,
        };
        this.position.x += normalized.x * this.speed * deltaTime;
        this.position.y += normalized.y * this.speed * deltaTime;
    }
}
//# sourceMappingURL=cell.js.map