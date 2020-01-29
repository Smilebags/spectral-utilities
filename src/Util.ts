export function lerp(a: number, b: number, mix: number): number {
  return (a * (1 - mix)) + (b * mix);
}

export function mapValue(
  value: number,
  inFrom: number,
  inTo: number,
  outFrom: number,
  outTo: number,
): number {
  const inRange = inTo - inFrom;
  const outRange = outTo - outFrom;
  const progress = (value - inFrom) / inRange;
  return (progress * outRange) + outFrom;
}

export function nextFrame() {
  return new Promise((resolve) => {
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
