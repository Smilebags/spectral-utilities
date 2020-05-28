import Colour from "../../Colour.js";
import { mapValue } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2, Vec3 } from "../../Vec.js";
import { ParabolicSpectrum } from "../../Spectrum/ParabolicSpectrum.js";
import { WrappingParabolicSpectrum } from "../../Spectrum/WrappingParabolicSpectrum.js";

const WAVELENGTH_LOW = 380;
const WAVELENGTH_HIGH = 730;

const LOW_COLOR = Colour.fromWavelength(WAVELENGTH_LOW);
const HIGH_COLOR = Colour.fromWavelength(WAVELENGTH_HIGH);

const LOCUS_SAMPLES = 300;
const PINK_EDGE_SAMPLES = 40;
const DESATURATION_SAMPLES = 100;
const CANVAS_SIZE = 800;

const wavelengthEl = document.querySelector('#wavelength') as HTMLInputElement;
const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE, false, 2.2, 0.18);

// const partFunction = (x: number) => (((((x**2) - (2 * x)) ** 0.5) - x + 1) ** (1/3));
// const inverseSmoothStep = (x: number) => partFunction(x) + 1 / (partFunction(x)) + 1;

const locusSamples = new Array(LOCUS_SAMPLES)
  .fill(null)
  .map(
    (item, index) => Colour.fromWavelength(
      mapValue((index / (LOCUS_SAMPLES - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH),
    ));

const pinkEdgeSamples = new Array(PINK_EDGE_SAMPLES)
  .fill(null)
  .map((item, index) => LOW_COLOR.lerp(
    HIGH_COLOR,
    mapValue(index, 0, PINK_EDGE_SAMPLES - 1, 0, 1) ** 0.5
  ));

const boundarySamples = [
  ...locusSamples,
  ...pinkEdgeSamples,
];

drawPoints(boundarySamples);

function drawPoints(points: Colour[]): void {
  points.forEach(point => {
    const location = point.toxyY();
    const mapped = new Vec2(location.triplet.x, location.triplet.y)
      .add(new Vec2(0.2, 0.05))
      .multiply(new Vec2(1, -1))
      .add(new Vec2(0, 1))
      .multiply(CANVAS_SIZE);
  
    canvasOutput.setPixel(
      point.toRec709().triplet.normalise(),
      new Vec2(Math.round(mapped.x), Math.round(mapped.y)),
    );
  });
}

// const wavelengthRange = WAVELENGTH_HIGH - WAVELENGTH_LOW;
// new Array(wavelengthRange).fill(null)
//   .forEach((item, index) => !(index % 5) && renderDesaturationCurve(mapValue(index, 0, wavelengthRange, WAVELENGTH_LOW, WAVELENGTH_HIGH)));

wavelengthEl.addEventListener('input', (e) => {
  if (!e) {
    return;
  }
  renderDesaturationCurve(Number((event!.target as HTMLInputElement).value));
});

renderDesaturationCurve(550);

type DesaturationStrategy = (wavelength: number, amount: number) => Colour;

function renderDesaturationCurve(wavelength: number) {
  const LobeWideningStrategy: DesaturationStrategy = (wavelength, amount) => {
    const width = mapValue(amount ** 3, 0, 1, 0.1, 300);
    const spectrum = new ParabolicSpectrum(
      wavelength,
      width,
    );
    return Colour.fromSpectrum(spectrum, 2** 8);
  };

  const XYZLerpStrategy: DesaturationStrategy = (wavelength, amount) => {
    return Colour.fromWavelength(wavelength).lerp(new Colour(new Vec3(1, 1, 1)), amount ** 2);
  };

  const OpposingLobeMixStrategy: DesaturationStrategy = (wavelength, amount) => {
    const width = mapValue(amount ** 3, 0, 1, 0.1, 300);
    const spectrum = new WrappingParabolicSpectrum(
      wavelength,
      width,
    );
    return Colour.fromSpectrum(spectrum, 2** 8);
  };

  const lobeDesaturationSamples = new Array(DESATURATION_SAMPLES)
    .fill(null)
    .map((item, index) => {
      const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1)
      return LobeWideningStrategy(wavelength, desaturationAmount);
    });

  const lerpDesaturationSamples = new Array(DESATURATION_SAMPLES)
    .fill(null)
    .map((item, index) => {
      const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1)
      return XYZLerpStrategy(wavelength, desaturationAmount);
    });
    
  const mixedDesaturationSamples = new Array(DESATURATION_SAMPLES)
    .fill(null)
    .map((item, index) => {
      const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1)
      const xyz = XYZLerpStrategy(wavelength, desaturationAmount);
      const lobe = LobeWideningStrategy(wavelength, desaturationAmount);
      return xyz.lerp(lobe, 0.9);
    });

  const opposingLobeMixSamples = new Array(DESATURATION_SAMPLES)
  .fill(null)
  .map((item, index) => {
    const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1)
    const xyz = XYZLerpStrategy(wavelength, desaturationAmount);
    const lobe = OpposingLobeMixStrategy(wavelength, desaturationAmount);
    return xyz.lerp(lobe, 0.9);
  });

  canvasOutput.clear();
  drawPoints(boundarySamples);
  drawPoints(opposingLobeMixSamples);
  drawPoints(lerpDesaturationSamples);
  // drawPoints(mixedDesaturationSamples);
}