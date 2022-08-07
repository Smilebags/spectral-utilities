import parabolic from "./Parabolic.js";
export class WrappingParabolicSpectrum {
    constructor(center, spread, gain = 1, pull = 0, low = 360, high = 830) {
        this.center = center;
        this.spread = spread;
        this.gain = gain;
        this.pull = pull;
        this.middle = (low + high) / 2;
        this.range = high - low;
    }
    sample(wavelength) {
        if (wavelength < this.middle) {
            return parabolic(this.center, this.spread, this.gain)(wavelength)
                + parabolic(this.center, this.spread, this.gain)(wavelength + this.range - this.pull);
        }
        return parabolic(this.center, this.spread, this.gain)(wavelength)
            + parabolic(this.center, this.spread, this.gain)(wavelength - this.range + this.pull);
    }
}
