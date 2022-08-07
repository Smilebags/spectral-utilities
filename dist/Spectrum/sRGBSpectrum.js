// import { lerp } from "../Util.js";
const WAVELENGTH_LOW = 380;
const WAVELENGTH_HIGH = 730;
export class SrgbSpectrum {
    constructor(rgbToIntensityLookups, r, g, b) {
        this.rgbToIntensityLookups = rgbToIntensityLookups;
        this.r = r;
        this.g = g;
        this.b = b;
    }
    sample(wavelength) {
        const rLightStrength = this.lookup('r', wavelength) * this.r;
        const gLightStrength = this.lookup('g', wavelength) * this.g;
        const bLightStrength = this.lookup('b', wavelength) * this.b;
        return rLightStrength + gLightStrength + bLightStrength;
    }
    lookup(channel, wavelength) {
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
