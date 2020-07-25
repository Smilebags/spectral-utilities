import Colour from "../../Colour.js";
import { mapValue, sleep } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2, Vec3 } from "../../Vec.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";
import { ColourSpaceName } from "../../types/index.js";
import colourSpaceProviderSingleton from "../../ColourSpaceProviderSingleton.js";

const colourSpaceOptionEl = document.querySelector('#colour-space') as HTMLOptionElement;


const CLIP_OUT_OF_GAMUT = false;
const WAVELENGTH_LOW = 420;
const WAVELENGTH_HIGH = 670;
const CANVAS_SIZE = 1000;
let DISPLAY_SPACE: ColourSpaceName = colourSpaceOptionEl.value as ColourSpaceName;


const canvasEl = document.querySelector('canvas#circle')! as HTMLCanvasElement;
const circleCanvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE, true, DISPLAY_SPACE);

const highQualityEl = document.querySelector('#high') as HTMLButtonElement;
const lowQualityEl = document.querySelector('#low') as HTMLButtonElement;
lowQualityEl.addEventListener('click', () => {
  render();
});
highQualityEl.addEventListener('click', () => {
  render(true);
});

colourSpaceOptionEl.addEventListener('change', (e) => {
  //@ts-ignore
  DISPLAY_SPACE = e.target.value;
  circleCanvasOutput.setTargetSpace(DISPLAY_SPACE);
  curveCanvasOutput.setTargetSpace(DISPLAY_SPACE);
  abneyCanvasOutput.setTargetSpace(DISPLAY_SPACE);
  circleCanvasOutput.clear();
  renderSwatches(SWATCH_WAVELENGTH);
});


const state = {
  desaturation: 1,
};

async function render(highQuality = false) {
  const SATURATION_SAMPLES = highQuality ? 240 : 220;

  for (let i = 0; i < SATURATION_SAMPLES; i++) {
    await sleep(1);
    state.desaturation = (i / (SATURATION_SAMPLES - 1)) ** 1.2;
    drawRing(highQuality);
  }
}

function drawRing(highQuality: boolean) {
  const HUE_SAMPLES = highQuality ? 720 : 120;
  const SPECTRUM_SAMPLE_SHIFT = highQuality ? 2 : 0;

  const gaussianWideningStrategy = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH);
  const points = createBoundaryValues(HUE_SAMPLES);
  const samplePoints = points.map((point, index, arr) => {
    const spectrumSamplePower = mapValue(state.desaturation ** 2, 0, 1, 6, 4) + SPECTRUM_SAMPLE_SHIFT;
    const spectrumSampleCount = Math.round(2 ** spectrumSamplePower);
    const colour = gaussianWideningStrategy.desaturate(
      point,
      state.desaturation,
      spectrumSampleCount,
    ).multiply(2);
    const progress = mapValue(index, 0, arr.length - 1, 0, Math.PI * 2);
    const radius = mapValue(state.desaturation, 0, 1, 1, 0);
    const location = new Vec2(
      Math.sin(progress) * radius,
      Math.cos(progress) * radius,
    );
    
    return { colour, location };
  });
  drawPoints(samplePoints);
}

// function createBoundaryValues(sampleCount: number) {
//   return new Array(sampleCount)
//     .fill(null)
//     .map(
//       (item, index) => {
//         const progress = index / (sampleCount - 1);
//         const firstIndex = findFirstIndex(adjustedCumulative, (item: any) => item[0] >= progress);
//         const wavelength = adjustedCumulative[firstIndex][1];
//         return wavelength;
//       });
// }

function createBoundaryValues(locusSampleCount: number) {
  return new Array(locusSampleCount)
    .fill(null)
    .map(
      (item, index) => 
        mapValue((index / (locusSampleCount - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH),
      );
}

function drawPoints(points: { colour: Colour, location: Vec2 }[]): void {
  points
    .map(({location, colour}) => {
      const mappedLocation = location.multiply(0.49).add(0.5);
        return {
          location: mappedLocation,
          colour,
        };
    })
    .forEach(({location, colour}, index, arr) => {
      if (index === 0) {
        return;
      }
      if (isColourOutOfGamut(colour) && CLIP_OUT_OF_GAMUT) {
        return;
      }
      circleCanvasOutput.drawLine({
        lineWidth: 0.003,
        from: arr[index - 1].location,
        to: location,
        color: colour,
      });
  });
}

function isColourOutOfGamut(colour: Colour): boolean {
  const inColourSpaceColour = colour.to(DISPLAY_SPACE);
  return (
    inColourSpaceColour.triplet.x >= 1 ||
    inColourSpaceColour.triplet.y >= 1 ||
    inColourSpaceColour.triplet.z >= 1 ||
    inColourSpaceColour.triplet.x <= 0 ||
    inColourSpaceColour.triplet.y <= 0 ||
    inColourSpaceColour.triplet.z <= 0
  );
}


const SWATCH_WIDTH = 200;
const STEP_COUNT = 10;
const SWATCH_SIZE = SWATCH_WIDTH / STEP_COUNT;

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
  false,
  DISPLAY_SPACE,
);
const abneyCanvasOutput = new CanvasOutput(
  abneyCanvasEl,
  SWATCH_WIDTH,
  10,
  false,
  DISPLAY_SPACE,
);
const gaussianWideningStrategy = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH);

renderSwatches(Number(swatchWavelengthEl.value));

function renderSwatches(wavelength: number) {
  fillWavelengthDial(wavelength);
  let startWidth = 0.02;
  const startSearchStep = 0.005;
  while(true) {
    const colour = gaussianWideningStrategy.desaturate(wavelength, startWidth, 2 ** 7);
    if (colour.to(DISPLAY_SPACE).allPositive) {
      break;
    }
    startWidth += startSearchStep;
  }
  const startColour = gaussianWideningStrategy.desaturate(wavelength, startWidth, 2 ** 7);
  console.log(startWidth);
  console.log(startColour);
  renderCurveSwatches(wavelength, startWidth, curveCanvasOutput);
  renderAbneySwatches(startColour.normalise(), abneyCanvasOutput);
}

function fillWavelengthDial(wavelength: number) {
  document.querySelector('#current-wavelength')!.innerHTML = String(wavelength);
}


function renderCurveSwatches(wavelength: number, startWidth: number, canvasOutput: CanvasOutput) {
  for (let swatchIndex = 0; swatchIndex < STEP_COUNT; swatchIndex++) {
    const mapped = mapValue(swatchIndex, 0, STEP_COUNT - 1, 0, 1);
    const stepped = steps(mapped, STEP_COUNT);
    const desaturation = mapValue(stepped, 0, 1, startWidth, 1);
    const colour = gaussianWideningStrategy.desaturate(wavelength, desaturation, 2 ** 7);
    for (let y = 0; y < SWATCH_SIZE; y++) {
      for (let x = 0; x < SWATCH_SIZE; x++) {
        canvasOutput.setPixel(
          colour.to('XYZ').normalise(),
          new Vec2(x + (swatchIndex * SWATCH_SIZE), y));
      }
    }
  }
  canvasOutput.redraw();
}

function renderAbneySwatches(colour: Colour, canvasOutput: CanvasOutput) {
  const start = 0;
  for (let swatchIndex = 0; swatchIndex < STEP_COUNT; swatchIndex++) {
    const mapped = mapValue(swatchIndex, 0, STEP_COUNT - 1, 0, 1);
    const stepped = steps(mapped, STEP_COUNT);
    const desaturation = mapValue(stepped, 0, 1, start, 1);
    const lerpedColour = colour
    .lerp(
      new Colour(
        new Vec3(1,1,1),
        'XYZ',
        colourSpaceProviderSingleton,
      ),
      desaturation);
    for (let y = 0; y < SWATCH_SIZE; y++) {
      for (let x = 0; x < SWATCH_SIZE; x++) {
        canvasOutput.setPixel(
          lerpedColour.to(DISPLAY_SPACE),
          new Vec2((swatchIndex * SWATCH_SIZE) + x, y));
      }
    }
  }
  canvasOutput.redraw();
}

function steps(value: number, steps: number): number {
  return Math.floor(value * steps) / steps;
}