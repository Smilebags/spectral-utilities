import parabolic from "./Parabolic.js";
export class ParabolicSpectrum {
    constructor(center, spread, gain = 1) {
        this.center = center;
        this.spread = spread;
        this.gain = gain;
    }
    sample(wavelength) {
        return parabolic(this.center, this.spread, this.gain)(wavelength);
    }
}
