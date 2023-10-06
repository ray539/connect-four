export interface coord {
  x: number;
  y: number;
}

export class Coord {

  public static round(coord: coord) {
    return {x: Math.floor(coord.x / 100) * 100, y: Math.floor(coord.y / 100) * 100}
  }

  public static add(coord1: coord, coord2: coord) {
    return {x: coord1.x + coord2.x, y: coord1.y + coord2.y}
  }

  public static sub(coord1: coord, coord2: coord) {
    return {x: coord1.x - coord2.x, y: coord1.y - coord2.y}
  }

  public static normalize(coord: coord) {
    let length = Math.sqrt(coord.x * coord.x + coord.y * coord.y);
    if (length === 0) return {x: 0, y: 0}
    return {x:coord.x / length, y:coord.y / length}
  }

  public static mult(coord: coord, scalar: number) {
    return {x:coord.x * scalar, y:coord.y * scalar}
  }

  public static toScreenCoords(coord: coord) {
    return {x: coord.x * 100 + 50, y: coord.y * 100 + 100}
  }
}