import { wavelengthLMSLookup } from "../../Colour/wavelengthToLMSLookup.js";
import { lerp } from "../../Util.js";
const WAVELENGTH_LOW = 390;
const WAVELENGTH_HIGH = 830;
const createChannelSpectrum = (channel) => ({
    sample(wavelength) {
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
const offsetSpectrum = (spectrum, offset) => ({
    sample: (wavelength) => spectrum.sample(wavelength - offset),
});
export const createColourBlindnessLMSSpectra = (lOffset, mOffset, sOffset) => {
    return {
        l: offsetSpectrum(lSpectrum, lOffset),
        m: offsetSpectrum(mSpectrum, mOffset),
        s: offsetSpectrum(sSpectrum, sOffset),
    };
};
