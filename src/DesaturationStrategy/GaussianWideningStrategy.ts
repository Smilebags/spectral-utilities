import { DesaturationStrategy } from "../types/index.js";
import { GaussianSpectrum } from "../Spectrum/GaussianSpectrum.js";
import Colour from "../Colour.js";
import { Vec3 } from "../Vec.js";
import { mapValue } from "../Util.js";




export default class GaussianWideningStrategy implements DesaturationStrategy {
  constructor(
    public wavelengthLow = 360,
    public wavelengthHigh = 830,
  ) {}

  private getWidthFromDesaturation(desaturation: number): number {
    if (desaturation <= 0) {
      return 0;
    }
    // if (desaturation >= 1) {
    //   return 2 ** 15;
    // }
    // return (1 / ((desaturation - 1) ** 2)) - 1;
    return mapValue(desaturation, 0, 1, 0.1, 200);
  }

  public desaturate(wavelengthOrPinkBias: number, amount: number): Colour {
    if (wavelengthOrPinkBias <= 1) {
      return this.pinkLobeWideningStrategy(wavelengthOrPinkBias, amount);
    }
    return this.locusLobeWideningStrategy(wavelengthOrPinkBias, amount);
  }

  private locusLobeWideningStrategy(wavelength: number, amount: number): Colour {
    const width = this.getWidthFromDesaturation(amount);
    // const width = mapValue(amount ** 3, 0, 1, 0.1, 300);
    const spectrum = new GaussianSpectrum(
      wavelength,
      width,
    );
    return Colour.fromSpectrum(spectrum, 2 ** 6);
  };

  
  private pinkLobeWideningStrategy(
    progress: number,
    desaturationAmount: number,
  ): Colour {
    // if (desaturationAmount === 1) {
    //   return new Colour(new Vec3(0.3,0.3,0.3), 'XYZ');
    // }
    const width = this.getWidthFromDesaturation(desaturationAmount);
    // const width = mapValue(desaturationAmount ** 5, 0, 1, 0.01, 100);

    const blueColor = Colour.fromSpectrum(new GaussianSpectrum(
      this.wavelengthLow,
      width,
    ), 2 ** 6);
    const blueEnergy = blueColor.sum;


    const redColor = Colour.fromSpectrum(new GaussianSpectrum(
      this.wavelengthHigh,
      width,
    ), 2 ** 6);

    const redEnergy = redColor.sum;

    const scaledBlue = blueColor.multiply((blueEnergy + redEnergy) / blueEnergy);
    const scaledRed = redColor.multiply((blueEnergy + redEnergy) / redEnergy);
    const correctXY = scaledBlue.lerp(scaledRed, progress);
    const energyCorrection = mapValue(progress, 0, 1, 1, blueEnergy);
    return correctXY.multiply(energyCorrection);
  };
}