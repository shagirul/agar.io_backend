export type Vector2D = {
  x: number;
  y: number;
};
export interface PlayerData {
  id: string;
  name: string;
  color: string;
  cells: {
    id: string;
    position: {
      x: number;
      y: number;
    };
    size: number;
  }[];
}
