// utility/MaptoObject.js
export function mapToObject(map: Map<string, { x: number; y: number }>): {
  [cellId: string]: { x: number; y: number };
} {
  return Object.fromEntries(map);
}
