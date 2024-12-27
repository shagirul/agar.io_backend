export default class Player {
    getId() {
        return this.id;
    }
    get playerSize() {
        return this.size;
    }
    // Getter for the name
    get playerName() {
        return this.name;
    }
    // Public getter for accessing the position of the player
    get position() {
        return { x: this.x, y: this.y };
    }
    // Constructor to initialize the player
    constructor(id, name, // Accepting name
    x, y, color, size = 10) {
        this.id = id;
        this.name = name; // Initialize name
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size; // Default size
    }
    // Method to update player position
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
    // Method to increase the player's size based on the apple's size
    increaseSize(apple) {
        this.size += apple.appleSize * 0.5; // Increase player size based on apple size
    }
    // Method to check for collision with an apple
    isCollidingWithApple(apple) {
        const distance = Math.sqrt(Math.pow(this.x - apple.position.x, 2) +
            Math.pow(this.y - apple.position.y, 2));
        const collisionThreshold = this.size + apple.appleSize; // Combine player size and apple size
        return distance < collisionThreshold; // Check if distance is smaller than the sum of the radii
    }
    // Method to retrieve player data
    getPlayerData() {
        return {
            id: this.id,
            name: this.name, // Include name in player data
            x: this.x,
            y: this.y,
            color: this.color,
            size: this.size, // Include size in player data
        };
    }
}
//# sourceMappingURL=player.js.map