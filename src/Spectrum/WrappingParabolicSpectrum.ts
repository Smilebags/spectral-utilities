import { Spectrum } from "./Spectrum.js";
import parabolic from "./Parabolic.js";

export class WrappingParabolicSpectrum implements Spectrum {
  private middle: number;
  private range: number;
  constructor(
    public center: number,
    public spread: number,
    public gain: number = 1,
    private pull = 0,
    low = 360,
    high = 830,
  ) {
    this.middle = (low + high) / 2;
    this.range = high - low;
  }
  sample(wavelength: number) {
    if (wavelength < this.middle) {
      return parabolic(this.center, this.spread, this.gain)(wavelength)
        + parabolic(this.center, this.spread, this.gain)(wavelength + this.range - this.pull);
    }
    return parabolic(this.center, this.spread, this.gain)(wavelength)
      + parabolic(this.center, this.spread, this.gain)(wavelength - this.range + this.pull);
  }
}
