import { DesaturationStrategy } from "../types/index.js";
import { GaussianSpectrum } from "../Spectrum/GaussianSpectrum.js";
import Colour from "../Colour.js";


export default class GaussianWideningStrategy implements DesaturationStrategy {
  private wavelengthRange = this.wavelengthHigh - this.wavelengthLow;
  constructor(
    private wavelengthLow: number,
    private wavelengthHigh: number,
  ) {}

  private getWidthFromDesaturation(desaturation: number): number {
    if (desaturation <= 0) {
      return 0;
    }
    return 50 * Math.log(1/(1-desaturation));
  }

  public desaturate(wavelength: number, amount: number, integrationSampleCount: number, wrap = true): Colour {
    const primary = this.locusLobeWideningStrategy(wavelength, amount, integrationSampleCount);
    if (!wrap) {
      return primary;
    }
    const above = this.locusLobeWideningStrategy(wavelength + this.wavelengthRange, amount, integrationSampleCount);
    const below = this.locusLobeWideningStrategy(wavelength - this.wavelengthRange, amount, integrationSampleCount);
    const twoAbove = this.locusLobeWideningStrategy(wavelength + (this.wavelengthRange * 2), amount, integrationSampleCount);
    const twoBelow = this.locusLobeWideningStrategy(wavelength - (this.wavelengthRange * 2), amount, integrationSampleCount);

    return Colour.fromAverage([
      primary,
      above,
      below,
      twoAbove,
      twoBelow,
    ]).multiply(5);
  }

  private locusLobeWideningStrategy(wavelength: number, amount: number, integrationSampleCount: number): Colour {
    const width = this.getWidthFromDesaturation(amount);
    const spectrum = new GaussianSpectrum(
      wavelength,
      width,
    );
    return Colour.fromSpectrum(spectrum, integrationSampleCount);
  };
}