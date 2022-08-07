import { mapValue } from "../Util.js";
export default class CoefficientSpectrum {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    sigmoid(x) {
        return 0.5 + (x / 1 + (x ** 2));
    }
    sample(wavelength) {
        const x = wavelength;
        const { a, b, c } = this;
        const parabola = (a * (x ** 2)) + (b * x) + c;
        return this.sigmoid(parabola);
    }
}
export class NormalisedCoefficientSpectrum {
    constructor(minWavelength, maxWavelength, center, width, sharpness) {
        this.minWavelength = minWavelength;
        this.maxWavelength = maxWavelength;
        this.center = center;
        this.width = width;
        this.sharpness = sharpness;
    }
    sigmoid(x) {
        const base = x / (1 + (x ** 2)) ** 0.5;
        return (base * 0.5) + 0.5;
    }
    sample(wavelength) {
        const x = wavelength;
        const { minWavelength, maxWavelength } = this;
        const center = mapValue(this.center, 0, 1, minWavelength, maxWavelength);
        const wavelengthRange = maxWavelength - minWavelength;
        const width = mapValue(this.width, 0, 1, 0, wavelengthRange);
        const sharpnessIntermediate = mapValue(this.sharpness, 0, 1, -1, 1);
        const sharpnessSign = sharpnessIntermediate > 0 ? 1 : -1;
        const sharpnessAmount = Math.abs(sharpnessIntermediate);
        const scaledSharpnessAmount = sharpnessAmount ** 3;
        const sharpness = sharpnessSign * scaledSharpnessAmount;
        const halfWidth = width / 2;
        const parabola = sharpness * (x - center - halfWidth) * (x - center + halfWidth);
        return this.sigmoid(parabola);
    }
}
