import { Spectrum } from "../types/index";

export default class CoefficientSpectrum implements Spectrum {
  constructor(
    private a: number,
    private b: number,
    private c: number,
  ) {}

  private sigmoid(x: number) {
    return 0.5 + (x / 1 + (x ** 2));
  }

  sample(wavelength: number) {
    const x = wavelength;
    const {a, b, c} = this;
    const parabola = (a * (x ** 2)) + (b * x) + c;
    return this.sigmoid(parabola);
  }
}
