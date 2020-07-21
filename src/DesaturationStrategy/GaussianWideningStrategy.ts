import { DesaturationStrategy } from "../types/index.js";
import { GaussianSpectrum } from "../Spectrum/GaussianSpectrum.js";
import Colour from "../Colour.js";


export default class GaussianWideningStrategy implements DesaturationStrategy {
  private wavelengthRange = this.wavelengthHigh - this.wavelengthLow;
  constructor(
    private wavelengthLow = 360,
    private wavelengthHigh = 830,
  ) {}

  private getWidthFromDesaturation(desaturation: number): number {
    if (desaturation <= 0) {
      return 0;
    }
    return 50 * Math.log(1/(1-desaturation));
  }

  public desaturate(wavelength: number, amount: number): Colour {
    const primary = this.locusLobeWideningStrategy(wavelength, amount);
    const above = this.locusLobeWideningStrategy(wavelength + this.wavelengthRange, amount);
    const below = this.locusLobeWideningStrategy(wavelength - this.wavelengthRange, amount);
    const twoAbove = this.locusLobeWideningStrategy(wavelength + (this.wavelengthRange * 2), amount);
    const twoBelow = this.locusLobeWideningStrategy(wavelength - (this.wavelengthRange * 2), amount);

    return Colour.fromAverage([
      primary,
      above,
      below,
      twoAbove,
      twoBelow,
    ]);
  }

  private locusLobeWideningStrategy(wavelength: number, amount: number): Colour {
    const width = this.getWidthFromDesaturation(amount);
    const spectrum = new GaussianSpectrum(
      wavelength,
      width,
    );
    return Colour.fromSpectrum(spectrum, 2 ** 6);
  };
}