export class Cell {
  id: string;
  position: { x: number; y: number };
  size: number;
  speed: number;
  owner: string; // Player ID
  lastMergeTime: number; // Timestamp for merge cooldown

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
  }

  calculateSpeed(): number {
    // Speed decreases with size
    return Math.max(5, 50 / Math.sqrt(this.size));
  }

  canMerge(): boolean {
    const cooldown = 30000 + (7 / 300) * this.size * 1000;
    return Date.now() - this.lastMergeTime > cooldown;
  }

  updatePosition(direction: { x: number; y: number }, deltaTime: number): void {
    const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    if (magnitude === 0) return;

    const normalized = {
      x: direction.x / magnitude,
      y: direction.y / magnitude,
    };
    this.position.x += normalized.x * this.speed * deltaTime;
    this.position.y += normalized.y * this.speed * deltaTime;
  }
}
