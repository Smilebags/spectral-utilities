import Colour from "../../Colour/Colour.js";
import { lerp, mapValue, sleep } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2, Vec3 } from "../../Vec.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";
import { ColourSpaceName } from "../../types/index.js";



const WAVELENGTH_LOW = 420;
const WAVELENGTH_HIGH = 670;
const SWATCH_WIDTH = 200;
const STEP_COUNT = 20;
const SWATCH_SIZE = SWATCH_WIDTH / STEP_COUNT;
const WORKING_SPACE: ColourSpaceName = 'REC.709';

const curveCanvasEl = document.querySelector('canvas#curve-swatch')! as HTMLCanvasElement;
const abneyCanvasEl = document.querySelector('canvas#abney-swatch')! as HTMLCanvasElement;
const swatchWavelengthEl = document.querySelector('#swatch-wavelength') as HTMLInputElement;
let SWATCH_WAVELENGTH = Number(swatchWavelengthEl.value);

swatchWavelengthEl.addEventListener('input', (e) => {
  //@ts-ignore
  SWATCH_WAVELENGTH = Number(e.target.value);
  renderSwatches(SWATCH_WAVELENGTH);
});

const curveCanvasOutput = new CanvasOutput(
  curveCanvasEl,
  SWATCH_WIDTH,
  10,
  true,
  'sRGB',
);
const abneyCanvasOutput = new CanvasOutput(
  abneyCanvasEl,
  SWATCH_WIDTH,
  10,
  true,
  'sRGB',
);
const gaussianWideningStrategy = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH);

renderSwatches(Number(swatchWavelengthEl.value));

function renderSwatches(wavelength: number) {
  fillWavelengthDial(wavelength);
  let startWidth = 0.016;
  const startSearchStep = 0.004;
  while(true) {
    const colour = gaussianWideningStrategy.desaturate(wavelength, startWidth, 2 ** 7).to('XYZD65');
    colour.colourSpace = 'XYZ';
    if (colour.to(WORKING_SPACE).allPositive) {
      break;
    }
    startWidth += startSearchStep;
  }
  const startColour = gaussianWideningStrategy.desaturate(wavelength, startWidth, 2 ** 7);
  renderCurveSwatches(wavelength, startWidth, curveCanvasOutput);
  renderAbneySwatches(startColour, abneyCanvasOutput);
}

function fillWavelengthDial(wavelength: number) {
  document.querySelector('#current-wavelength')!.innerHTML = String(wavelength);
}


function renderCurveSwatches(wavelength: number, startWidth: number, canvasOutput: CanvasOutput) {
  for (let swatchIndex = 0; swatchIndex < STEP_COUNT; swatchIndex++) {
    const mapped = mapValue(swatchIndex, 0, STEP_COUNT - 1, 0, 1);
    const curveApplied = mapped ** 0.8;
    const desaturation = mapValue(curveApplied, 0, 1, startWidth, 0.8);
    const colour = gaussianWideningStrategy.desaturate(wavelength, desaturation, 2 ** 7).to('XYZD65');
    colour.colourSpace = 'XYZ';
    for (let y = 0; y < SWATCH_SIZE; y++) {
      for (let x = 0; x < SWATCH_SIZE; x++) {
        canvasOutput.setPixel(
          colour.to(WORKING_SPACE).normalise().multiply(0.999),
          new Vec2(x + (swatchIndex * SWATCH_SIZE), y));
      }
    }
  }
  canvasOutput.redraw();
}

function renderAbneySwatches(colour: Colour, canvasOutput: CanvasOutput) {
  const destinationColour = new Colour(new Vec3(1,1,1), WORKING_SPACE);
  let startColour = colour.to('XYZD65');
  startColour.colourSpace = 'XYZ';
  startColour = startColour.to(WORKING_SPACE).normalise();
  for (let swatchIndex = 0; swatchIndex < STEP_COUNT; swatchIndex++) {
    const mapped = mapValue(swatchIndex, 0, STEP_COUNT - 1, 0, 1);
    const lerpedColour = startColour
      .multiply(1-mapped)
      .add(destinationColour.multiply(mapped));
    for (let y = 0; y < SWATCH_SIZE; y++) {
      for (let x = 0; x < SWATCH_SIZE; x++) {
        canvasOutput.setPixel(
          lerpedColour.multiply(0.999),
          new Vec2((swatchIndex * SWATCH_SIZE) + x, y));
      }
    }
  }
  canvasOutput.redraw();
}

function steps(value: number, steps: number): number {
  return Math.floor(value * steps) / steps;
}