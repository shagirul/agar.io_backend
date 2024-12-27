export default class Apple {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }
    // Getter for apple position
    get position() {
        return { x: this.x, y: this.y };
    }
    // Getter for apple size
    get appleSize() {
        return this.size;
    }
    // Update apple's position
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
}
//# sourceMappingURL=apple.js.map