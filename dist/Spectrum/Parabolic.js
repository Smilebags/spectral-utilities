export default function parabolic(center, width, peak = 1) {
    return (sample) => {
        const distance = sample - center;
        const scaled = distance / width;
        return peak / (1 + (scaled ** 2));
    };
}
