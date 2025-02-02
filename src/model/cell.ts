import { Vector2D } from "../utils/types.js";
import Apple from "./apple.js";

export class Cell {
  id: string;
  position: { x: number; y: number };
  size: number;
  speed: number;
  owner: string; // Player ID
  lastMergeTime: number; // Timestamp for merge cooldown
  splitCooldown: number;

  constructor(
    id: string,
    position: { x: number; y: number },
    size: number,
    owner: string
  ) {
    this.id = id;
    this.position = position;
    this.size = size;
    this.speed = this.calculateSpeed();
    this.owner = owner;
    this.lastMergeTime = Date.now();
    this.splitCooldown = 0;
  }
  canMerge(): boolean {
    const cooldown = 30000 + (7 / 300) * this.size * 1000;
    return Date.now() - this.lastMergeTime > cooldown;
  }
  getPosition(): { x: number; y: number } {
    return this.position;
  }

  calculateSpeed(): number {
    const newSpeed = Math.max(5, 1000 / Math.sqrt(this.size)); // Speed calculation formula
    return newSpeed;
  }
  updateSize(newSize: number): void {
    this.size = newSize; // Update the size
    this.speed = this.calculateSpeed(); // Recalculate speed based on the new size
  }

  updatePosition(target: Vector2D | null, deltaTime: number): void {
    if (!target) return;

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

  public isCollidingWithApple(apple: Apple): boolean {
    const applePosition = apple.getPosition(); // Use the `getPosition` method of Apple
    const appleSize = apple.appleSize; // Use the `appleSize` getter of Apple

    const distance = Math.sqrt(
      Math.pow(this.position.x - applePosition.x, 2) +
        Math.pow(this.position.y - applePosition.y, 2)
    );
    const collisionThreshold = this.size + appleSize; // Combine cell size and apple size
    return distance < collisionThreshold; // Check if distance is smaller than the sum of the radii
  }
}
