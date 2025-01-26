export default class Apple {
  private position: { x: number; y: number };

  private size: number;

  constructor(position: { x: number; y: number }, size: number) {
    this.size = size;
    this.position = position;
  }

  // Getter for apple position
  public getPosition(): { x: number; y: number } {
    return this.position;
  }

  // Getter for apple size
  public get appleSize(): number {
    return this.size;
  }

  // Update apple's position
  public updatePosition(position: { x: number; y: number }): void {
    this.position = position;
  }
}
