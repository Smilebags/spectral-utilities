import Colour from "../../Colour/Colour.js";
import { lerp, mapValue } from "../../Util.js";
import { Vec3 } from "../../Vec.js";
export const createCustomLMSColourConverter = (lmsLookup, sampleCount = 64, wavelengthLow = 380, wavelengthHigh = 730) => (spectrum) => {
    const l = accumulateSamples(spectrum, lmsLookup.l, sampleCount, wavelengthLow, wavelengthHigh);
    const m = accumulateSamples(spectrum, lmsLookup.m, sampleCount, wavelengthLow, wavelengthHigh);
    const s = accumulateSamples(spectrum, lmsLookup.s, sampleCount, wavelengthLow, wavelengthHigh);
    return new Colour(new Vec3(l, m, s), 'LMS');
};
function accumulateSamples(colourSpectrum, sensitivitySpectrum, sampleCount, wavelengthLow, wavelengthHigh) {
    let total = 0;
    for (let i = 0; i < sampleCount; i++) {
        const progress = mapValue(i, 0, sampleCount - 1, 0, 1);
        const wavelength = lerp(wavelengthLow, wavelengthHigh, progress);
        const intensity = colourSpectrum.sample(wavelength);
        const sensitivity = sensitivitySpectrum.sample(wavelength);
        total += intensity * sensitivity;
    }
    return total;
}
