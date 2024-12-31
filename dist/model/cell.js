export class Cell {
    constructor(id, position, size, owner) {
        this.id = id;
        this.position = position;
        this.size = size;
        this.speed = this.calculateSpeed();
        this.owner = owner;
        this.lastMergeTime = Date.now();
    }
    canMerge() {
        const cooldown = 30000 + (7 / 300) * this.size * 1000;
        return Date.now() - this.lastMergeTime > cooldown;
    }
    getPosition() {
        return this.position;
    }
    calculateSpeed() {
        const newSpeed = Math.max(5, 100 / Math.sqrt(this.size)); // Speed calculation formula
        return newSpeed;
    }
    updateSize(newSize) {
        this.size = newSize; // Update the size
        this.speed = this.calculateSpeed(); // Recalculate speed based on the new size
    }
    // updatePosition(target: Vector2D | null, deltaTime: number): void {
    //   if (!target) {
    //     // If target is null, don't move the cell
    //     return;
    //   }
    //   // Calculate the direction vector from the current position to the target
    //   const direction = {
    //     x: target.x - this.position.x,
    //     y: target.y - this.position.y,
    //   };
    //   const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    //   // If the cell is already at the target position or the magnitude is 0, stop
    //   if (magnitude === 0 || magnitude < this.speed * deltaTime) {
    //     this.position.x = target.x;
    //     this.position.y = target.y;
    //     return;
    //   }
    //   // Normalize the direction vector
    //   const normalized = {
    //     x: direction.x / magnitude,
    //     y: direction.y / magnitude,
    //   };
    //   // Update the cell's position based on its speed and normalized direction
    //   this.position.x += normalized.x * this.speed * deltaTime;
    //   this.position.y += normalized.y * this.speed * deltaTime;
    // }
    updatePosition(target, deltaTime) {
        if (!target)
            return;
        // Calculate the direction vector towards the target
        const direction = {
            x: target.x - this.position.x,
            y: target.y - this.position.y,
        };
        const distance = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        // If the target is very close, stop moving
        if (distance < this.speed * deltaTime) {
            this.position.x = target.x;
            this.position.y = target.y;
            return;
        }
        // Normalize the direction and apply movement
        const normalized = { x: direction.x / distance, y: direction.y / distance };
        this.position.x += normalized.x * this.speed * deltaTime;
        this.position.y += normalized.y * this.speed * deltaTime;
    }
    isCollidingWithApple(apple) {
        const applePosition = apple.getPosition(); // Use the `getPosition` method of Apple
        const appleSize = apple.appleSize; // Use the `appleSize` getter of Apple
        const distance = Math.sqrt(Math.pow(this.position.x - applePosition.x, 2) +
            Math.pow(this.position.y - applePosition.y, 2));
        const collisionThreshold = this.size + appleSize; // Combine cell size and apple size
        return distance < collisionThreshold; // Check if distance is smaller than the sum of the radii
    }
}
//# sourceMappingURL=cell.js.map