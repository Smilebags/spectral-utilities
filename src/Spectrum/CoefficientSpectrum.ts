import { Spectrum } from "./Spectrum";
import { mapValue } from "../Util.js";

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

export class NormalisedCoefficientSpectrum {
  constructor(
    private minWavelength: number,
    private maxWavelength: number,
    private center: number,
    private width: number,
    private sharpness: number,
  ) { }

  private sigmoid(x: number) {
    const base = x / (1 + (x ** 2)) ** 0.5;
    return (base * 0.5) + 0.5;
  }

  sample(wavelength: number) {
    const x = wavelength;
    const { minWavelength, maxWavelength } = this;
    const center = mapValue(this.center, 0, 1, minWavelength, maxWavelength);
    const wavelengthRange = maxWavelength - minWavelength;
    const width = mapValue(this.width, 0, 1, 0, wavelengthRange);
    const sharpnessIntermediate = mapValue(this.sharpness, 0, 1, -1, 1);
    const sharpnessSign = sharpnessIntermediate > 0 ? 1 : -1;
    const sharpnessAmount = Math.abs(sharpnessIntermediate);
    const scaledSharpnessAmount = sharpnessAmount ** 3;
    const sharpness = sharpnessSign * scaledSharpnessAmount;
    const halfWidth = width / 2;
    const parabola = sharpness * (x - center - halfWidth) * (x - center + halfWidth);
    return this.sigmoid(parabola);
  }
}
