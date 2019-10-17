export function lerp(a: number, b: number, mix: number): number {
  return (a * (1 - mix)) + (b * mix);
}