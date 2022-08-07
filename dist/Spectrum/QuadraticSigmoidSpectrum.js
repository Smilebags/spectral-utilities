export default class QuadraticSigmoidSpectrum {
    constructor(mid, width, sharpness) {
        this.mid = mid;
        this.width = width;
        this.sharpness = sharpness;
    }
    sample(x) {
        const arc = this.sharpness / this.width;
        const aRoot = this.width + this.mid;
        const bRoot = -this.width + this.mid;
        return this.sigmoid(arc * (x - aRoot) * (x - bRoot));
    }
    sigmoid(x) {
        return 0.5 + (x / (2 * ((1 + (x ** 2)) ** 0.5)));
    }
}
