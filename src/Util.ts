import { Matrix } from "./Colour/ColourSpace.js";
import { Vec3 } from "./Vec.js";

export function lerp(a: number, b: number, mix: number): number {
  return (a * (1 - mix)) + (b * mix);
}

export function lerp3(a: Vec3, b: Vec3, mix: Vec3): Vec3 {
  return new Vec3(
    lerp(a[0], b[0], mix[0]),
    lerp(a[1], b[1], mix[1]),
    lerp(a[2], b[2], mix[2]),
  )
}

export function mapValue(
  value: number,
  inFrom: number,
  inTo: number,
  outFrom: number,
  outTo: number,
  clampToOutRange = false,
): number {
  const inRange = inTo - inFrom;
  const outRange = outTo - outFrom;
  const progress = (value - inFrom) / inRange;
  if (clampToOutRange) {
    return clamp(
      (progress * outRange) + outFrom,
      Math.min(outTo, outFrom),
      Math.max(outTo, outFrom),
    );
  }
  return (progress * outRange) + outFrom;
}

export function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export function clamp(value: number, low: number, high: number): number {
  if (value < low) {
    return low;
  }
  if (value > high) {
    return high;
  }
  return value;
}

export function logN(value: number, base: number): number {
  return Math.log(value) / Math.log(base);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function matrixMultiply(matrix: Matrix, numbers: [number, number, number]): [number, number, number] {
  return [
    matrix[0][0] * numbers[0] + matrix[0][1] * numbers[1] + matrix[0][2] * numbers[2],
    matrix[1][0] * numbers[0] + matrix[1][1] * numbers[1] + matrix[1][2] * numbers[2],
    matrix[2][0] * numbers[0] + matrix[2][1] * numbers[1] + matrix[2][2] * numbers[2],
  ];
}

export function arraySum(arr: number[]): number {
  return arr.reduce((total, current) => (total + current), 0);
}

export function arrayAverage(arr: number[]): number {
  return arraySum(arr) / arr.length;
}