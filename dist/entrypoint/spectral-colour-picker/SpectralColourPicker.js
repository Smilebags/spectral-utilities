import CircleGradient from "../../Shapes/CircleGradient.js";
import Dot from "../../Shapes/Dot.js";
import { Vec2, Vec3 } from "../../Vec.js";
import Colour from "../../Colour/Colour.js";
import { mapValue } from "../../Util.js";
import { ParabolicSpectrum } from "../../Spectrum/ParabolicSpectrum.js";
const shift = 0.2;
const blue = 430;
const red = 660;
const white = new Colour(new Vec3(1, 1, 1), "REC.709");
const black = new Colour(new Vec3(0, 0, 0), "REC.709");
const spectrumGradientFunction = (phase) => {
    const shiftedPhase = (phase + shift) % 1;
    if (shiftedPhase <= 0.3) {
        const a = Colour.fromWavelength(red);
        const b = Colour.fromWavelength(blue);
        return a.lerp(b, shiftedPhase / 0.3);
    }
    return Colour.fromWavelength(mapValue(shiftedPhase, 0.3, 1, blue, red));
};
export class SpectralColourPicker {
    constructor(canvas, spectrumSamplingLowWavelength = 390, spectrumSamplingHighWavelength = 830, spectrumSamplingResolution = 64) {
        this.canvas = canvas;
        this.spectrumSamplingLowWavelength = spectrumSamplingLowWavelength;
        this.spectrumSamplingHighWavelength = spectrumSamplingHighWavelength;
        this.spectrumSamplingResolution = spectrumSamplingResolution;
        this.selectedIndex = 0;
        this.baseSpectra = [
            new ParabolicSpectrum(460, 10, 6),
        ];
        this.spectrumCircle = new CircleGradient(spectrumGradientFunction);
        this.colourDot = new Dot(() => this.getResultantColour(), 0.75);
        requestAnimationFrame(() => this.render());
    }
    get selectedSpectrum() {
        return this.baseSpectra[this.selectedIndex];
    }
    handleMousemove(uv) {
        const centerRelative = uv.subtract(new Vec2(0.5, 0.5));
        const angle = Math.atan2(centerRelative.y, centerRelative.x);
        this.selectedSpectrum.center = mapValue(angle, -Math.PI, Math.PI, this.spectrumSamplingLowWavelength, this.spectrumSamplingHighWavelength);
        console.log(`Angle: ${angle.toFixed(3)}`);
    }
    get totalSpectrum() {
        return {
            sample: (wavelength) => {
                return this.baseSpectra
                    .reduce((sum, spectrum) => sum + spectrum.sample(wavelength), 0);
            },
        };
    }
    deepSample(spectrum) {
        let sum = new Colour(new Vec3(0, 0, 0), 'XYZ');
        for (let i = 0; i < this.spectrumSamplingResolution; i++) {
            const wavelength = mapValue(i, 0, this.spectrumSamplingResolution, this.spectrumSamplingLowWavelength, this.spectrumSamplingHighWavelength);
            const intensity = spectrum.sample(wavelength);
            const baseColour = Colour.fromWavelength(wavelength);
            sum = sum.add(baseColour.multiply(intensity));
        }
        return sum.multiply(1 / this.spectrumSamplingResolution);
    }
    getResultantColour() {
        return this.deepSample(this.totalSpectrum);
    }
    // private renderSpectrumPoints() {
    //   const outline = new Dot(() => black, 0.12)
    //   this.baseSpectra.forEach(baseSpectrum => {
    //     this.ctx.save();
    //     const colour = this.deepSample(baseSpectrum).multiply(this.baseSpectra.length)
    //     const phase = this.getWavelengthPhase(baseSpectrum.center);
    //     const x = Math.sin((Math.PI * 2) * phase) * 0.9;
    //     const y = Math.cos((Math.PI * 2) * phase) * 0.9;
    //     const dot = new Dot(() => colour, 0.1);
    //     this.ctx.translate(x, y);
    //     outline.render(this.ctx);
    //     dot.render(this.ctx);
    //     this.ctx.restore();
    //   });
    // }
    getWavelengthPhase(wavelength) {
        const phase = mapValue(wavelength, blue, red, 0.3, 1);
        return (phase + (1 - shift)) % 1;
    }
    render() {
        // this.canvas.drawLine({
        //   lineWidth: 0.1,
        //   from: new Vec2(0, 0),
        //   to: new Vec2(1, 1),
        //   color: Colour.fromWavelength(400).multiply(2**5),
        // })
        this.spectrumCircle.render(this.canvas);
        // this.clear();
        // this.ctx.save();
        //   this.ctx.translate(this.width / 2, this.height / 2);
        //   const zoom = 0.4;
        //   this.ctx.scale(this.width * zoom, this.height * zoom);
        // this.colourDot.render(this.ctx);
        //   this.renderSpectrumPoints();
        // this.ctx.restore();
        requestAnimationFrame(() => this.render());
    }
}
