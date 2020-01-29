export default function parabolic(center: number, width: number, peak: number = 1) {
  return (sample: number) => {
    const distance = sample - center;
    const scaled = distance / width;
    return peak / (1 + (scaled **2));
  };
}
