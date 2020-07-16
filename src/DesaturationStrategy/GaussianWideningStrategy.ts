import { DesaturationStrategy } from "../types/index.js";
import { GaussianSpectrum } from "../Spectrum/GaussianSpectrum.js";
import Colour from "../Colour.js";
import { mapValue } from "../Util.js";




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
    if (desaturation >= 1) {
      return 10 ** 10;
    }
    // return (1 / ((desaturation - 1) ** 2)) - 1;
    return mapValue(desaturation, 0, 1, 0.1, 200);
  }

  public desaturate(wavelength: number, amount: number): Colour {
    const primary = this.locusLobeWideningStrategy(wavelength, amount);
    const above = this.locusLobeWideningStrategy(wavelength + this.wavelengthRange, amount);
    const below = this.locusLobeWideningStrategy(wavelength - this.wavelengthRange, amount);
    
    // const totalAboveEnergy = primary.sum + above.sum + below.sum;
    // const totalBelowEnergy = primary.sum + above.sum + below.sum;

    // const aboveFactor = above.sum / totalAboveEnergy;
    // const belowFactor = below.sum / totalBelowEnergy;

    // const scaledPrimary = primary;
    // const scaledAbove = above.multiply(aboveFactor);
    // const scaledBelow = below.multiply(belowFactor);
    return Colour.fromAverage([
      primary,
      above,
      below,
    ]).multiply(8.5);
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