import Colour from "../../Colour/Colour.js";
import { mapValue, sleep } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2 } from "../../Vec.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";
import { adjustedCumulative, findFirstIndex } from './xy-distance.js';

const CLIP_OUT_OF_GAMUT = false;
const WAVELENGTH_LOW = 390;
const WAVELENGTH_HIGH = 830;
const CANVAS_SIZE = 1500;


const refineEl = document.querySelector('#refine') as HTMLButtonElement;
const canvasEl = document.querySelector('canvas')!;

const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE, true);

const state = {
  desaturation: 1,
};

refineEl.addEventListener('click', () => {
  render(true);
});

render();

async function render(highQuality = false) {
  const SATURATION_SAMPLES = highQuality ? 240 : 220;

  for (let i = 0; i < SATURATION_SAMPLES; i++) {
    await sleep(1);
    state.desaturation = (i / (SATURATION_SAMPLES - 1)) ** 1.2;
    drawRing(highQuality);
  }
}

function drawRing(highQuality: boolean) {
  const MAGENTA_LENGTH = 0.00;
  const LOCUS_SAMPLE_COUNT = highQuality ? 720 : 120;
  const SPECTRUM_SAMPLE_SHIFT = highQuality ? 2 : 0;
  const MAGENTA_SAMPLE_COUNT = Math.floor(LOCUS_SAMPLE_COUNT * 0.3);
  const LOCUS_LENGTH = 1 - MAGENTA_LENGTH;

  const gaussianWideningStrategy = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH);
  const locusPoints = createBoundaryValues(LOCUS_SAMPLE_COUNT);
  const locusSamplePoints = locusPoints.map((point, index, arr) => {
    const spectrumSamplePower = mapValue(state.desaturation ** 2, 0, 1, 6, 4) + SPECTRUM_SAMPLE_SHIFT;
    const spectrumSampleCount = Math.round(2 ** spectrumSamplePower);
    const colour = gaussianWideningStrategy.desaturate(
      point,
      state.desaturation,
      spectrumSampleCount,
      false,
    ).multiply(3);
    const progress = mapValue(index, 0, arr.length - 1, 0, Math.PI * 2 * LOCUS_LENGTH);
    const radius = mapValue(state.desaturation, 0, 1, 1, 0);
    const location = new Vec2(
      Math.sin(progress) * radius,
      Math.cos(progress) * radius,
    );
    
    return { colour, location };
  });

  const magentaPoints = createMagentaValues(MAGENTA_SAMPLE_COUNT);
  const magentaSamplePoints = magentaPoints.map((progress) => {
    const spectrumSamplePower = mapValue(state.desaturation ** 2, 0, 1, 6, 4) + SPECTRUM_SAMPLE_SHIFT;
    const spectrumSampleCount = Math.round(2 ** spectrumSamplePower);
    const redColour = gaussianWideningStrategy.desaturate(
      WAVELENGTH_HIGH,
      state.desaturation,
      spectrumSampleCount,
      false,
    ).multiply(3);
    const blueColour = gaussianWideningStrategy.desaturate(
      WAVELENGTH_LOW,
      state.desaturation,
      spectrumSampleCount,
      false,
    ).multiply(4);
    const radius = mapValue(state.desaturation, 0, 1, 1, 0);
    const radialProgress = mapValue(progress, 0, 1, Math.PI * 2 * LOCUS_LENGTH, Math.PI * 2);
    const location = new Vec2(
      Math.sin(radialProgress) * radius,
      Math.cos(radialProgress) * radius,
    );
    const scaledRed = redColour.triplet.multiply(1 - progress);
    const scaledBlue = blueColour.triplet.multiply(progress);
    const newColourCoordinate = scaledRed.add(scaledBlue);
    const colour = new Colour(newColourCoordinate, 'XYZ');
    
    return { colour, location };
  });
  drawPoints([
    ...locusSamplePoints,
    // ...magentaSamplePoints,
  ]);
}

function createBoundaryValues(sampleCount: number) {
  return new Array(sampleCount)
    .fill(null)
    .map(
      (item, index) => {
        const progress = index / (sampleCount - 1);
        const firstIndex = findFirstIndex(adjustedCumulative, (item: any) => item[0] >= progress);
        const wavelength = adjustedCumulative[firstIndex][1];
        return wavelength;
      });
}

// function createBoundaryValues(locusSampleCount: number) {
//   return new Array(locusSampleCount)
//     .fill(null)
//     .map(
//       (item, index) => 
//         mapValue((index / (locusSampleCount - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH),
//       );
// }


function createMagentaValues(sampleCount: number) {
  return new Array(sampleCount)
    .fill(null)
    .map(
      (item, index) => {
        return index / (sampleCount - 1);
      });
  
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
      if (isColourOutOfRec709Gamut(colour) && CLIP_OUT_OF_GAMUT) {
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

function isColourOutOfRec709Gamut(colour: Colour): boolean {
  const rec709Colour = colour.to('REC.709');
  return (
    rec709Colour.triplet.x >= 1 ||
    rec709Colour.triplet.y >= 1 ||
    rec709Colour.triplet.z >= 1 ||
    rec709Colour.triplet.x <= 0 ||
    rec709Colour.triplet.y <= 0 ||
    rec709Colour.triplet.z <= 0
  );
}