export default class Apple {
  private x: number;
  private y: number;
  private size: number;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  // Getter for apple position
  public get position(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  // Getter for apple size
  public get appleSize(): number {
    return this.size;
  }

  // Update apple's position
  public updatePosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}
