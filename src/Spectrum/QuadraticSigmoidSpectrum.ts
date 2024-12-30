import { Spectrum } from "./Spectrum";

export default class QuadraticSigmoidSpectrum implements Spectrum {
  constructor(
    private mid: number,
    private width: number,
    private sharpness: number,
  ) {}

  sample(x: number) {
    const arc = this.sharpness / this.width;
    const aRoot = this.width + this.mid;
    const bRoot = - this.width + this.mid;

    return this.sigmoid(arc * (x - aRoot) * (x - bRoot));
  }
  
  private sigmoid(x: number) {
    return 0.5 + (x / (2 * ((1 + (x ** 2)) ** 0.5)))
  }
}
