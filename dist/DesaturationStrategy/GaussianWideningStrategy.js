import { GaussianSpectrum } from "../Spectrum/GaussianSpectrum.js";
import Colour from "../Colour/Colour.js";
import { arrayAverage } from "../Util.js";
export default class GaussianWideningStrategy {
    constructor(wavelengthLow, wavelengthHigh) {
        this.wavelengthLow = wavelengthLow;
        this.wavelengthHigh = wavelengthHigh;
        this.wavelengthRange = this.wavelengthHigh - this.wavelengthLow;
    }
    getWidthFromDesaturation(desaturation) {
        if (desaturation <= 0) {
            return 0;
        }
        return 50 * Math.log(1 / (1 - desaturation));
    }
    desaturate(wavelength, amount, integrationSampleCount, wrap = true) {
        return Colour.fromSpectrum(this.desaturateWithInfo(wavelength, amount, wrap).spectrum, integrationSampleCount);
    }
    desaturateWithInfo(wavelength, amount, wrap = true) {
        const width = this.getWidthFromDesaturation(amount);
        const base = new GaussianSpectrum(wavelength, width);
        if (!wrap) {
            return {
                spectrum: base,
                width,
            };
        }
        const below = new GaussianSpectrum(wavelength - this.wavelengthRange, width);
        const above = new GaussianSpectrum(wavelength + this.wavelengthRange, width);
        const twoBelow = new GaussianSpectrum(wavelength - (this.wavelengthRange * 2), width);
        const twoAbove = new GaussianSpectrum(wavelength + (this.wavelengthRange * 2), width);
        const avgSpectrum = {
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
        };
    }
}
