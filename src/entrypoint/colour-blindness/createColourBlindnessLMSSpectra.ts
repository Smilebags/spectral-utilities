import { wavelengthLMSLookup } from "../../Colour/wavelengthToLMSLookup.js";
import { Spectrum } from "../../Spectrum/Spectrum.js";
import { lerp } from "../../Util.js";
import { LMSLookup } from "./ColourFromSpectrumCustomLMS.js";

const WAVELENGTH_LOW = 390;
const WAVELENGTH_HIGH = 830;
type ZERO_ONE_OR_TWO = 0 | 1 | 2;

const createChannelSpectrum = (channel: ZERO_ONE_OR_TWO): Spectrum => ({
    sample(wavelength: number) {
        if (wavelength < WAVELENGTH_LOW || wavelength > WAVELENGTH_HIGH) {
            return 0;
          }
          const index = (wavelength - WAVELENGTH_LOW);
          const low = wavelengthLMSLookup[Math.floor(index)][1][channel];
          const high = wavelengthLMSLookup[Math.ceil(index)][1][channel];
          const progress = index % 1;
          return lerp(low, high, progress);
    }

});
const lSpectrum = createChannelSpectrum(0);
const mSpectrum = createChannelSpectrum(1);
const sSpectrum = createChannelSpectrum(2);

const blendSpectrum = (a: Spectrum, b: Spectrum, blend: number) => ({
    sample: (wavelength: number) => lerp(a.sample(wavelength), b.sample(wavelength), blend),
});

export const createColourBlindnessLMSSpectra = (
    lOffset: number,
    mOffset: number,
    sOffset: number,
): LMSLookup => {
    return {
        l: blendSpectrum(lSpectrum, mSpectrum, lOffset / 100),
        m: blendSpectrum(mSpectrum, lSpectrum, mOffset / 100),
        s: blendSpectrum(sSpectrum, blendSpectrum(lSpectrum, mSpectrum, 0.5), sOffset / 100),
    };
};
