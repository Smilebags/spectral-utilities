function generateGaussianFunction(height, center, width) {
    return (x) => {
        const exponent = -((x - center) ** 2) / ((2 * width) ** 2);
        const baseCurve = Math.E ** exponent;
        return height * baseCurve;
    };
}
export class GaussianSpectrum {
    constructor(center, width, gain = 1) {
        this.curve = generateGaussianFunction(gain, center, width);
    }
    sample(wavelength) {
        return this.curve(wavelength);
    }
}
