export class Food {
  id: string;
  position: { x: number; y: number };
  size: number;

  constructor(id: string, position: { x: number; y: number }) {
    this.id = id;
    this.position = position;
    this.size = 1; // Default size
  }
}
