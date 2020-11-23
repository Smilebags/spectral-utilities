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

  public desaturate(wavelength: number, amount: number, integrationSampleCount: number, wrap = true): Colour {
    const width = this.getWidthFromDesaturation(amount);
    const base = new GaussianSpectrum(wavelength, width);
      if (!wrap) {
        return Colour.fromSpectrum(base, integrationSampleCount, this.wavelengthLow, this.wavelengthHigh);
      }
    const below = new GaussianSpectrum(wavelength - this.wavelengthRange, width);
    const above = new GaussianSpectrum(wavelength + this.wavelengthRange, width);
    const twoBelow = new GaussianSpectrum(wavelength - (this.wavelengthRange * 2), width);
    const twoAbove = new GaussianSpectrum(wavelength + (this.wavelengthRange * 2), width);
    const maxSpectrum: Spectrum = {
      sample: x => Math.max(
        base.sample(x),
        below.sample(x),
        above.sample(x),
      ),
    };
    
    const avgSpectrum: Spectrum = {
      sample: x => arrayAverage([
        base.sample(x),
        below.sample(x),
        above.sample(x),
        twoBelow.sample(x),
        twoAbove.sample(x),
      ]),
    };

    return Colour.fromSpectrum(avgSpectrum, integrationSampleCount, this.wavelengthLow, this.wavelengthHigh);
    
    // const result = Colour.fromSpectrum(avgSpectrum, integrationSampleCount, this.wavelengthLow, this.wavelengthHigh);
    // const xyYResult = result.to('xyY');
    // const Y = xyYResult.triplet.z * 10;
    // const mappedY = Y / (Y + 1);
    // xyYResult.triplet.z = mappedY;
    // return xyYResult;
    // const clampedY = result.to('xyY');
    // clampedY.triplet.z = Math.min(clampedY.triplet.z * 2, 1);
    // return clampedY;
    // const result = new Colour(new Vec3(averagex, averagey, baseY), 'xyY');
    // return result;
    
  };
}