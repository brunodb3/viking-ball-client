import { IVector } from "@interfaces";

export function lerp(start: number, end: number, rate: number) {
  return (1 - rate) * start + rate * end;
}

export function lerpVector(
  start: IVector,
  end: IVector,
  rate: number
): IVector {
  return {
    x: (1 - rate) * start.x + rate * end.x,
    y: (1 - rate) * start.y + rate * end.y,
  };
}
