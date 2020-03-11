import CircleGradient from "./Shapes/CircleGradient.js";
import Dot from "./Shapes/Dot.js";
import { Vec2, Vec3 } from "./Vec.js";
import { Spectrum } from "./types/index.js";
import Colour from "./Colour.js";
import { mapValue } from "./Util.js";
import { ParabolicSpectrum } from "./Spectrum/ParabolicSpectrum.js";


const shift = 0.2;
const blue = 430;
const red = 660;

const white = new Colour(new Vec3(1,1,1), "REC.709");
const black = new Colour(new Vec3(0,0,0), "REC.709");

const spectrumGradientFunction = (phase: number) => {
  const shiftedPhase = (phase + shift) % 1;
  if (shiftedPhase <= 0.3) {
    const a = Colour.fromWavelength(red);
    const b = Colour.fromWavelength(blue);
    return a.lerp(b, shiftedPhase / 0.3);
  }
  return Colour.fromWavelength(mapValue(shiftedPhase, 0.3, 1, blue, red));
};

export class SpectralColourPicker {
  ctx = this.canvas.getContext('2d')!;
  spectrumCircle: CircleGradient;
  colourDot: Dot;
  baseSpectra: ParabolicSpectrum[] = [
    new ParabolicSpectrum(360, 10, 6),
    new ParabolicSpectrum(200, 50, 1),
  ];
  constructor(
    private canvas: HTMLCanvasElement,
    private width: number = 500,
    private height: number = 500,
    private spectrumSamplingLowWavelength = 380,
    private spectrumSamplingHighWavelength = 830,
    private spectrumSamplingResolution = 64,
  ) {
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.spectrumCircle = new CircleGradient(spectrumGradientFunction);
    this.colourDot = new Dot(
      () => this.getResultantColour(),
      0.75,
    );

    requestAnimationFrame(() => this.render());
  }

  toCanvasCoordinates(e: MouseEvent): Vec2 {
    // e = Mouse click event.
    var rect = this.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.
    return new Vec2(x, y);
  }

  get totalSpectrum(): Spectrum {
    return {
      sample: (wavelength: number) => {
        return this.baseSpectra
        .reduce(
          (sum, spectrum) => sum + spectrum.sample(wavelength),
          0,
        );
      },
    };
  }

  deepSample(spectrum: Spectrum): Colour {
    let sum = new Colour(new Vec3(0, 0, 0), 'XYZ');
    for (let i = 0; i < this.spectrumSamplingResolution; i++) {
      const wavelength = mapValue(
        i,
        0,
        this.spectrumSamplingResolution,
        this.spectrumSamplingLowWavelength,
        this.spectrumSamplingHighWavelength,
      );
      const intensity = spectrum.sample(wavelength);
      const baseColour = Colour.fromWavelength(wavelength);
      sum = sum.add(baseColour.multiply(intensity));      
    }
    return sum.multiply(1 / this.spectrumSamplingResolution);
  }

  getResultantColour(): Colour {
    return this.deepSample(this.totalSpectrum);
  }

  renderSpectrumPoints() {
    const outline = new Dot(() => black, 0.12)
    this.baseSpectra.forEach(baseSpectrum => {
      this.ctx.save();
      const colour = this.deepSample(baseSpectrum).multiply(this.baseSpectra.length)
      const phase = this.getWavelengthPhase(baseSpectrum.center);
      const x = Math.sin((Math.PI * 2) * phase) * 0.9;
      const y = Math.cos((Math.PI * 2) * phase) * 0.9;
      const dot = new Dot(() => colour, 0.1);
      this.ctx.translate(x, y);
      outline.render(this.ctx);
      dot.render(this.ctx);
      this.ctx.restore();
    });
  }

  jiggle() {
    this.baseSpectra.forEach(baseSpectrum => {
      baseSpectrum.center += (Math.random() - 0.45) * 2;
    });
  }

  getWavelengthPhase(wavelength: number): number {
    const phase = mapValue(wavelength, blue, red, 0.3, 1);
    return (phase + (1 - shift)) % 1;
  }

  clear() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  render(): void {
    this.jiggle();
    this.clear();
    this.ctx.save();
      this.ctx.translate(this.width / 2, this.height / 2);
      const zoom = 0.4;
      this.ctx.scale(this.width * zoom, this.height * zoom);
      this.spectrumCircle.render(this.ctx);
      this.colourDot.render(this.ctx);
      this.renderSpectrumPoints();
    this.ctx.restore();
    requestAnimationFrame(() => this.render());
  }
}
