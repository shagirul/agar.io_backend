import Apple from "./apple.js";

export default class Player {
  private id: string;
  private x: number;
  private y: number;
  private color: string;
  private size: number;
  private name: string; // New name field

  public getId(): string {
    return this.id;
  }

  public get playerSize(): number {
    return this.size;
  }

  // Getter for the name
  public get playerName(): string {
    return this.name;
  }

  // Public getter for accessing the position of the player
  public get position(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  // Constructor to initialize the player
  constructor(
    id: string,
    name: string, // Accepting name
    x: number,
    y: number,
    color: string,
    size: number = 10
  ) {
    this.id = id;
    this.name = name; // Initialize name
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size; // Default size
  }

  // Method to update player position
  public updatePosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  // Method to increase the player's size based on the apple's size
  public increaseSize(apple: Apple): void {
    this.size += apple.appleSize * 0.5; // Increase player size based on apple size
  }

  // Method to check for collision with an apple
  public isCollidingWithApple(apple: Apple): boolean {
    const distance = Math.sqrt(
      Math.pow(this.x - apple.position.x, 2) +
        Math.pow(this.y - apple.position.y, 2)
    );
    const collisionThreshold = this.size + apple.appleSize; // Combine player size and apple size
    return distance < collisionThreshold; // Check if distance is smaller than the sum of the radii
  }

  // Method to retrieve player data
  public getPlayerData() {
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
