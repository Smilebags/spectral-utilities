import { Spectrum } from "./Spectrum.js";
import parabolic from "./Parabolic.js";

export class ParabolicSpectrum implements Spectrum {
  constructor(public center: number, public spread: number, public gain: number = 1) { }
  sample(wavelength: number) {
    return parabolic(this.center, this.spread, this.gain)(wavelength);
  }
}
