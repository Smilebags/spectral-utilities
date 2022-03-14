import Colour from "../../Colour/Colour.js";
import { mapValue, sleep } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2, Vec3 } from "../../Vec.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";
import { ColourSpaceName } from "../../types/index.js";

const CLIP_OUT_OF_GAMUT = false;
const WAVELENGTH_LOW = 420;
const WAVELENGTH_HIGH = 670;
const CANVAS_SIZE = 1000;
// const DISPLAY_SPACE: ColourSpaceName = 'sRGB';
const DISPLAY_SPACE: ColourSpaceName = 'Display-P3';


const canvasEl = document.querySelector('canvas#circle')! as HTMLCanvasElement;
const options = { colorSpace: 'display-p3' };
canvasEl.width = CANVAS_SIZE;
canvasEl.height = CANVAS_SIZE;
const p3Context = canvasEl.getContext('2d', options)! as CanvasRenderingContext2D;
const circleCanvasOutput = new CanvasOutput(p3Context, CANVAS_SIZE, CANVAS_SIZE, true, DISPLAY_SPACE);

const highQualityEl = document.querySelector('#high') as HTMLButtonElement;
const lowQualityEl = document.querySelector('#low') as HTMLButtonElement;
// const gamutEl = document.querySelector('#gamut') as HTMLButtonElement;

lowQualityEl.addEventListener('click', () => {
  render();
});
highQualityEl.addEventListener('click', () => {
  render(true);
});
// gamutEl.addEventListener('click', () => {
//   fixGamut();
// });

// render();

// function fixGamut() {
//   const imgData = circleCanvasOutput.getImageData();
//   console.log(imgData);
  
//   const p3ImgData = new ImageData(imgData.width, imgData.height);
//   p3ImgData.data.set(imgData.data);
//   console.log(p3ImgData);
//   p3Context.putImageData(p3ImgData, 0, 0);
// }

async function render(highQuality = false) {
  const SATURATION_SAMPLES = highQuality ? 240 : 220;

  for (let i = 0; i < SATURATION_SAMPLES; i++) {
    await sleep(1);
    const desaturation = (i / (SATURATION_SAMPLES - 1)) ** 1.2;
    drawRing(desaturation, highQuality);
  }
}

function drawRing(desaturation: number, highQuality: boolean) {
  console.log('ring')
  const HUE_SAMPLES = highQuality ? 720 : 120;
  const SPECTRUM_SAMPLE_SHIFT = highQuality ? 2 : 0;

  const gaussianWideningStrategy = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH);
  const points = createBoundaryValues(HUE_SAMPLES);
  const samplePoints = points.map((point, index, arr) => {
    const spectrumSamplePower = mapValue(desaturation ** 2, 0, 1, 6, 4) + SPECTRUM_SAMPLE_SHIFT;
    const spectrumSampleCount = Math.round(2 ** spectrumSamplePower);
    const colour = gaussianWideningStrategy.desaturate(
      point,
      desaturation,
      spectrumSampleCount,
    );
    const adaptedColour = colour.to('XYZD65');
    adaptedColour.colourSpace = 'XYZ';
    const toneCompressedColour = adaptedColour.to('xyY');
    toneCompressedColour.triplet.z = reinhard(toneCompressedColour.triplet.z * 8);
    const progress = mapValue(index, 0, arr.length - 1, 0, Math.PI * 2);
    const radius = mapValue(desaturation, 0, 1, 1, 0);
    const location = new Vec2(
      Math.sin(progress) * radius,
      Math.cos(progress) * radius,
    );
    return { colour: toneCompressedColour, location };
  });
  drawPoints(samplePoints);
}

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

function reinhard(x: number) {
  return x / (x + 1);
}