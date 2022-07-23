import { Spectrum } from "../types/index.js";
// import { lerp } from "../Util.js";

const WAVELENGTH_LOW = 380;
const WAVELENGTH_HIGH = 730;

type RGBLookups = {
  r: Spectrum,
  g: Spectrum,
  b: Spectrum,
};

export class SrgbSpectrum implements Spectrum {
  constructor(
    private rgbToIntensityLookups: RGBLookups,
    private r: number,
    private g: number,
    private b: number,
  ) { }

  sample(wavelength: number) {
    const rLightStrength = this.lookup('r', wavelength) * this.r;
    const gLightStrength = this.lookup('g', wavelength) * this.g;
    const bLightStrength = this.lookup('b', wavelength) * this.b;
    return rLightStrength + gLightStrength + bLightStrength;
  }

  private lookup(channel: 'r' | 'g' | 'b', wavelength: number): number {
    return this.rgbToIntensityLookups[channel].sample(wavelength);
  }
}

// private isInt(n: number) {
//   return (n - Math.floor(n)) < 0.00001;
// }

// if (wavelength < WAVELENGTH_LOW || wavelength > WAVELENGTH_HIGH) {
//   return 0;
// }
// if (this.isInt(wavelength)) {
//   return this.rgbToIntensityLookups[channel][Math.floor(wavelength) - WAVELENGTH_LOW];
// }
// const low = this.rgbToIntensityLookups[channel][Math.floor(wavelength) - WAVELENGTH_LOW];
// const high = this.rgbToIntensityLookups[channel][Math.ceil(wavelength) - WAVELENGTH_LOW];
// const mix = lerp(low, high, wavelength % 1);
// return mix;