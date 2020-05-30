import { Spectrum } from "../types/index.js";
import parabolic from "./Parabolic.js";

function generateGaussianFunction(height: number, center: number, width: number) {
  return (x: number) => {
    const exponent = -((x - center) ** 2) / ((2 * width) ** 2);
    const baseCurve = Math.E ** exponent;
    return height * baseCurve;
  };
}

export class GaussianSpectrum implements Spectrum {
  private curve: (x: number) => number;
  constructor(center: number, width: number, gain: number = 1) {
    this.curve = generateGaussianFunction(gain, center, width);
  }
  sample(wavelength: number) {
    return this.curve(wavelength);
  }
}
