export default class Apple {
    constructor(position, size) {
        this.size = size;
        this.position = position;
    }
    // Getter for apple position
    getPosition() {
        return this.position;
    }
    // Getter for apple size
    get appleSize() {
        return this.size;
    }
    // Update apple's position
    updatePosition(position) {
        this.position = position;
    }
}
//# sourceMappingURL=apple.js.map