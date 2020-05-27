import Colour from "../../Colour.js";
import { mapValue } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2 } from "../../Vec.js";
import { ParabolicSpectrum } from "../../Spectrum/ParabolicSpectrum.js";

const WAVELENGTH_LOW = 380;
const WAVELENGTH_HIGH = 730;

const LOW_COLOR = Colour.fromWavelength(WAVELENGTH_LOW);
const HIGH_COLOR = Colour.fromWavelength(WAVELENGTH_HIGH);

const LOCUS_SAMPLES = 300;
const PINK_EDGE_SAMPLES = 40;
const DESATURATION_SAMPLES = 200;
const CANVAS_SIZE = 800;

const wavelengthEl = document.querySelector('#wavelength') as HTMLInputElement;
const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE, false, 2.2, 0);

const locusSamples = new Array(LOCUS_SAMPLES)
  .fill(null)
  .map(
    (item, index) => Colour.fromWavelength(
      mapValue(index, 0, LOCUS_SAMPLES-1, WAVELENGTH_LOW, WAVELENGTH_HIGH),
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

wavelengthEl.addEventListener('input', (e) => {
  if (!e) {
    return;
  }
  renderDesaturationCurve(Number((event!.target as HTMLInputElement).value));
});

// const wavelengthRange = WAVELENGTH_HIGH - WAVELENGTH_LOW;
// new Array(wavelengthRange).fill(null)
//   .forEach((item, index) => !(index % 5) && renderDesaturationCurve(mapValue(index, 0, wavelengthRange, WAVELENGTH_LOW, WAVELENGTH_HIGH)));
renderDesaturationCurve(550);

function renderDesaturationCurve(wavelength: number) {
  const desaturationSamples = new Array(DESATURATION_SAMPLES)
    .fill(null)
    .map((item, index) => {
      const normalisedWidth = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1);
      const width = mapValue(normalisedWidth ** 2, 0, 1, 0.1, 300);
      return new ParabolicSpectrum(
        wavelength,
        width,
      );
    })
    .map(spectrum => Colour.fromSpectrum(spectrum,2 ** 8));
  canvasOutput.clear();
  drawPoints(boundarySamples);
  drawPoints(desaturationSamples);
}