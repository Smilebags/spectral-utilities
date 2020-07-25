import Colour from "../../Colour.js";
import { mapValue, sleep } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2, Vec3 } from "../../Vec.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";


const WAVELENGTH_LOW = 390;
const WAVELENGTH_HIGH = 830;

const LOW_COLOR = Colour.fromWavelength(WAVELENGTH_LOW).normalise();
const HIGH_COLOR = Colour.fromWavelength(WAVELENGTH_HIGH).normalise();

const LOCUS_SAMPLES = 300;
const PINK_EDGE_SAMPLES = 40;
const DESATURATION_SAMPLES = 60;
const CANVAS_SIZE = 1000;

const locusEl = document.querySelector('#locusWavelength') as HTMLInputElement;
const desaturationEl = document.querySelector('#desaturation') as HTMLInputElement;

const modeEl = document.querySelector('#mode') as HTMLButtonElement;
const sweepEl = document.querySelector('#sweep') as HTMLButtonElement;

const abneySwatchEl = document.querySelector('#abneySwatchLobe') as HTMLDivElement;
const gaussianSwatchEl = document.querySelector('#gaussianSwatchLobe') as HTMLDivElement;

const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE);


const state = {
  mode: 'saturation',
  desaturation: 0.85,
  locusWavelength: 550,
  pinkProgress: 0.5,
  sweep: false,
};

const boundarySamples = createBoundarySamples(LOCUS_SAMPLES, PINK_EDGE_SAMPLES);

render(true);

locusEl.addEventListener('input', (e) => {
  if (!e) {
    return;
  }
  state.locusWavelength = Number((event!.target as HTMLInputElement).value);
  render(true);
});
desaturationEl.addEventListener('input', (e) => {
  if (!e) {
    return;
  }
  state.desaturation = Number((event!.target as HTMLInputElement).value);
  render(true);
});
sweepEl.addEventListener('click', () => {
  sweep();
});
modeEl.addEventListener('click', () => {
  toggleMode();
});

function toggleMode() {
  if (state.mode === 'saturation') {
    state.mode = 'hue';
    locusEl.style.display = 'none';
    desaturationEl.style.display = 'block';
  } else {
    state.mode = 'saturation';
    locusEl.style.display = 'block';
    desaturationEl.style.display = 'none';
  }
  modeEl.innerText = state.mode;
}

async function sweep() {
  // canvasOutput.clear(true);
  drawPoints(boundarySamples);
  if(state.mode === 'hue') {
    await sweepHue();
    return;
  }
  if(state.mode === 'saturation') {
    await sweepSaturation();
    return;
  }
}

async function sweepHue() {
  for (let i = 0; i < 20; i++) {
    await sleep(1);
    state.desaturation = i / 19;
    render();
  }
}
async function sweepSaturation() {
  for (let i = 0; i < 50; i++) {
    await sleep(1);
    state.locusWavelength = mapValue(i, 0, 49, WAVELENGTH_LOW, WAVELENGTH_HIGH);
    state.pinkProgress = mapValue(i, 0, 49, 0, 1);
    render();
  }
}



function render(clear = false) {
  if (clear) {
    canvasOutput.clear(true);
    drawPoints(boundarySamples);
  }
  if (state.mode === 'hue') {
    renderHue();
    return;
  }
  if (state.mode === 'saturation') {
    renderSaturation();
    return;
  }
}

function renderHue() {
  const gaussianWideningStrategy = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH);
  const points = createBoundaryValues(LOCUS_SAMPLES);
  const colours = points.map(point => gaussianWideningStrategy.desaturate(point, state.desaturation, 2 ** 7));
  drawPoints(colours);
}

function renderSaturation() {
  const gaussianWideningStrategy = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH);

  const locusWavelength = state.locusWavelength;
  const lobeDesaturationSamples = new Array(DESATURATION_SAMPLES)
    .fill(null)
    .map((item, index) => {
      const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1);
      return gaussianWideningStrategy.desaturate(locusWavelength, desaturationAmount, 2 ** 7);
    });
  drawPoints(lobeDesaturationSamples);

  // const pinkProgress = state.pinkProgress;
  // const pinkDesaturationSamples = new Array(DESATURATION_SAMPLES)
  //   .fill(null)
  //   .map((item, index) => {
  //     const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1);
  //     return gaussianWideningStrategy.desaturate(pinkProgress, desaturationAmount);
  //   });
  // drawPoints(pinkDesaturationSamples);
  fillSwatches(lobeDesaturationSamples);
}

function fillSwatches(lobeSamples: Colour[]) {
  const clippedColour = lobeSamples[1].to('REC.709').normalise().clamp();
  abneySwatchEl.style.backgroundColor = clippedColour.hex;

  for (let i = 1; i < lobeSamples.length; i++) {
    const sample = lobeSamples[i];
    if (sample.to('REC.709').allPositive) {
      console.log(sample.to('REC.709').normalise().hex);
      gaussianSwatchEl.style.backgroundColor = sample.to('REC.709').normalise().hex;
      break;
    }
  }

  // const clippedPinkColour = pinkSamples[1].toRec709().normalise().clamp();
  // abneySwatchPinkEl.style.backgroundColor = clippedPinkColour.hex;

  // for (let i = 1; i < pinkSamples.length; i++) {
  //   const sample = pinkSamples[i];
  //   if (sample.toRec709().allPositive) {
  //     console.log(sample.toRec709().normalise().hex);
  //     gaussianSwatchPinkEl.style.backgroundColor = sample.toRec709().normalise().hex;
  //     break;
  //   }
  // }
}


function createBoundaryValues(locusSampleCount: number) {
  const locusPoints = new Array(locusSampleCount)
    .fill(null)
    .map(
      (item, index) => 
        mapValue((index / (locusSampleCount - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH),
      );
  
  // const pinkEdgePoints = new Array(pinkEdgeSampleCount)
  //   .fill(null)
  //   .map((item, index) => mapValue(index, 0, pinkEdgeSampleCount - 1, 0, 1)
  //   );
  
  return [
    ...locusPoints,
    // ...pinkEdgePoints,
  ];
}


function createBoundarySamples(locusSampleCount: number, pinkEdgeSampleCount: number) {
  const locusSamples = new Array(locusSampleCount)
    .fill(null)
    .map(
      (item, index) => Colour.fromWavelength(
        mapValue((index / (locusSampleCount - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH),
      ));
  
  const pinkEdgeSamples = new Array(pinkEdgeSampleCount)
    .fill(null)
    .map((item, index) => LOW_COLOR.lerp(
      HIGH_COLOR,
      mapValue(index, 0, pinkEdgeSampleCount - 1, 0, 1) ** 0.5
    ));
  
  return [
    ...locusSamples,
    ...pinkEdgeSamples,
  ];
}

function drawDot(point: Colour): void {
  const xyYlocation = point.to('xyY');
  const location = new Vec2(xyYlocation.triplet.x, xyYlocation.triplet.y).add(0.1);
  canvasOutput.drawCircle({
    radius: 0.05,
    location,
    color: point,
  });
}

function drawPoints(points: Colour[]): void {
  points
    .map(point => {
      const xyYlocation = point.to('xyY');
      const mappedLocation = new Vec2(xyYlocation.triplet.x, xyYlocation.triplet.y).add(0.1);
        return {
          location: mappedLocation,
          colour: point,
        };
    })
    .forEach(({location, colour}, index, arr) => {
      if (index === 0) {
        return;
      }
      canvasOutput.drawLine({
        lineWidth: 0.003,
        from: arr[index - 1].location,
        to: location,
        color: colour,
      });
  });
}
