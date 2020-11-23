import { DesaturationStrategy, Spectrum } from "../types/index.js";
import { GaussianSpectrum } from "../Spectrum/GaussianSpectrum.js";
import Colour from "../Colour/Colour.js";
import { arrayAverage, arraySum } from "../Util.js";
import { Vec3 } from "../Vec.js";


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

  public desaturate(
    wavelength: number,
    amount: number,
    integrationSampleCount: number,
    wrap = true,
  ): Colour {
    return Colour.fromSpectrum(
      this.desaturateWithInfo(wavelength, amount, wrap).spectrum,
      integrationSampleCount,
    );
  }

  public desaturateWithInfo(
    wavelength: number,
    amount: number,
    wrap = true,
  ): {
    spectrum: Spectrum,
    width: number,
  } {
    const width = this.getWidthFromDesaturation(amount);
    const base = new GaussianSpectrum(wavelength, width);
      if (!wrap) {
        return {
          spectrum: base,
          width,
        }
      }
    const below = new GaussianSpectrum(wavelength - this.wavelengthRange, width);
    const above = new GaussianSpectrum(wavelength + this.wavelengthRange, width);
    const twoBelow = new GaussianSpectrum(wavelength - (this.wavelengthRange * 2), width);
    const twoAbove = new GaussianSpectrum(wavelength + (this.wavelengthRange * 2), width);

    const avgSpectrum: Spectrum = {
      sample: x => arrayAverage([
        base.sample(x),
        below.sample(x),
        above.sample(x),
        twoBelow.sample(x),
        twoAbove.sample(x),
      ]),
    };

    return {
      spectrum: avgSpectrum,
      width,
    }
  }
}
