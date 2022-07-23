// import { ChromaticAdaptation } from "../../Colour/ChromaticAdaptation.js";
// import Colour from "../../Colour/Colour.js";
// import { NormalisedCoefficientSpectrum } from "../../Spectrum/CoefficientSpectrum.js";
import Colour from "../../Colour/Colour.js";
import { SrgbSpectrum } from "../../Spectrum/sRGBSpectrum.js";
import { Spectrum } from "../../types/index.js";
import { createCustomLMSColourConverter } from "./ColourFromSpectrumCustomLMS.js";
import { createColourBlindnessLMSSpectra } from "./createColourBlindnessLMSSpectra.js";
import { sRGBToIntensityLookups } from "./sRGBToIntensityLookups.js";

const WAVELENGTH_LOW = 380;
const WAVELENGTH_HIGH = 730;

const colourCanvas = document.getElementById("colour") as HTMLCanvasElement;
const colourContext: CanvasRenderingContext2D = colourCanvas.getContext("2d")! as CanvasRenderingContext2D;

const lSlider = document.getElementById('l') as HTMLInputElement;
const mSlider = document.getElementById('m') as HTMLInputElement;
const sSlider = document.getElementById('s') as HTMLInputElement;

const resetButton = document.getElementById('reset') as HTMLButtonElement;
const protanomalyButton = document.getElementById('protanomaly') as HTMLButtonElement;
const deuteranomalyButton = document.getElementById('deuteranomaly') as HTMLButtonElement;

function setupObservers() {
  lSlider.addEventListener('input', redraw);
  mSlider.addEventListener('input', redraw);
  sSlider.addEventListener('input', redraw);
  resetButton.addEventListener('click', resetSliders);
  protanomalyButton.addEventListener('click', applyProtanomaly);
  deuteranomalyButton.addEventListener('click', applyDeuteranomaly);
}

function resetSliders() {
  lSlider.value = '0';
  mSlider.value = '0';
  sSlider.value = '0';
  redraw();
}
function applyProtanomaly() {
  lSlider.value = '-50';
  mSlider.value = '0';
  sSlider.value = '0';
  redraw();
}
function applyDeuteranomaly() {
  lSlider.value = '0';
  mSlider.value = '48';
  sSlider.value = '0';
  redraw();
}

function redraw() {
  const lVal = Number(lSlider.value);
  const mVal = Number(mSlider.value);
  const sVal = Number(sSlider.value);
  const lmsLookup = createColourBlindnessLMSSpectra(lVal, mVal, sVal);
  const observer = createCustomLMSColourConverter(lmsLookup, 64, WAVELENGTH_LOW, WAVELENGTH_HIGH);
  render(colourContext, observer);
}


setupObservers();
redraw();

type Region = {
  x: number,
  y: number,
  width: number,
  height: number,
};

function render(
  colourCtx: CanvasRenderingContext2D,
  humanObserver: (spectrum: Spectrum) => Colour,
) {
  drawSpectrumToRegion(
    new SrgbSpectrum(sRGBToIntensityLookups, 1, 0, 0),
    { x: 0, y: 0, width: 0.25, height: 0.5 },
  );
  drawSpectrumToRegion(
    new SrgbSpectrum(sRGBToIntensityLookups, 0, 1, 0),
    { x: 0.25, y: 0, width: 0.25, height: 0.5 },
  );
  drawSpectrumToRegion(
    new SrgbSpectrum(sRGBToIntensityLookups, 0, 0, 1),
    { x: 0.5, y: 0, width: 0.25, height: 0.5 },
  );
  drawSpectrumToRegion(
    new SrgbSpectrum(sRGBToIntensityLookups, 1, 1, 1),
    { x: 0.75, y: 0, width: 0.25, height: 0.5 },
  );
  drawSpectrumToRegion(
    new SrgbSpectrum(sRGBToIntensityLookups, 0, 1, 1),
    { x: 0, y: 0.5, width: 0.25, height: 0.5 },
  );
  drawSpectrumToRegion(
    new SrgbSpectrum(sRGBToIntensityLookups, 1, 0, 1),
    { x: 0.25, y: 0.5, width: 0.25, height: 0.5 },
  );
  drawSpectrumToRegion(
    new SrgbSpectrum(sRGBToIntensityLookups, 1, 1, 0),
    { x: 0.5, y: 0.5, width: 0.25, height: 0.5 },
  );
  drawSpectrumToRegion(
    new SrgbSpectrum(sRGBToIntensityLookups, 0, 0, 0),
    { x: 0.75, y: 0.5, width: 0.25, height: 0.5 },
  );

  function drawSpectrumToRegion(spectrum: Spectrum, region: Region) {
    const colour = humanObserver(spectrum).to('REC.709').multiply(0.05);
    colourCtx.fillStyle = colour.sRGBHex;
    const canvasWidth = colourCtx.canvas.width;
    const canvasHeight = colourCtx.canvas.height;
    const x = region.x * canvasWidth;
    const y = region.y * canvasHeight;
    const width = region.width * canvasWidth;
    const height = region.height * canvasHeight;
    colourCtx.fillRect(x, y, width, height);
  }
}


// function renderColourScope(ctx: CanvasRenderingContext2D, spectrum: Spectrum) {

//   const isInGamut = targetGamutColour.allPositive;

//   if (!isInGamut) {
//     if (USE_P3_IMAGEDATA_HACK) {
//       drawP3RectUsingImageData(
//         ctx,
//         ctx.canvas.width - 40,
//         ctx.canvas.height - 40,
//         40,
//         40,
//         new Colour(new Vec3(1, 0, 0), 'Display-P3'),
//       );
//     } else {
//       ctx.fillStyle = USE_P3 ? 'color(display-p3 1 0 0)' : 'red';
//       ctx.fillRect(ctx.canvas.width - 40, ctx.canvas.height - 40, 40, 40);
//     }
//     ctx.canvas.title = 'Colour is out of gamut';
//   } else {
//     ctx.canvas.title = 'Colour is in gamut';
//   }
// }

// function renderScopeBackground(ctx: CanvasRenderingContext2D) {
//   let imageData: ImageData | null = null; 
//   if (USE_P3_IMAGEDATA_HACK) {
//     imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
//   }
//   for (let i = 0; i < ctx.canvas.width; i++) {
//     const wavelength = mapValue(i, 0, ctx.canvas.width, WAVELENGTH_LOW, WAVELENGTH_HIGH);
//     let colour = Colour.fromWavelength(wavelength).lerp(ie.multiply(0.5), 0.5);
//     colour = new ChromaticAdaptation().adapt(colour, ie, targetWhite, true);
//     if (USE_P3_IMAGEDATA_HACK && imageData) {
//       assignRectToP3ImageData(imageData, i, 0, 1, ctx.canvas.height, colour);
//     } else {
//       ctx.fillStyle = USE_P3 ? colour.cssP3ColorString : colour.sRGBHex;
//       ctx.fillRect(i, 0, 1, ctx.canvas.height);
//     }
//   }
//   if (USE_P3_IMAGEDATA_HACK && imageData) {
//     ctx.putImageData(imageData, 0, 0);
//   }
// }

// function assignRectToP3ImageData(
//   imageData: ImageData,
//   xCoord: number,
//   yCoord: number,
//   width: number,
//   height: number,
//   colour: Colour,
// ) {
//   const data = imageData.data;
//   const { x: r, y: g, z: b } = colour.to('Display-P3').triplet;
//   for (let j = 0; j < height; j++) {
//     for (let i = 0; i < width; i++) {
//       const offset = ((j + yCoord) * imageData.width + (i + xCoord)) * 4;
//       data[offset] = r * 255;
//       data[offset + 1] = g * 255;
//       data[offset + 2] = b * 255;
//       data[offset + 3] = 255;
//     }
//   }
// }

// function drawP3RectUsingImageData(
//   ctx: CanvasRenderingContext2D,
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   colour: Colour,
// ) {
//   const imageData = ctx.getImageData(x, y, width, height);
//   assignRectToP3ImageData(imageData, 0, 0, width, height, colour);
//   ctx.putImageData(imageData, x, y);
// }

// function checkP3CanvasSupport() {
//   const canvas = document.createElement('canvas');
//   canvas.width = 1;
//   canvas.height = 1;
//   const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' })! as CanvasRenderingContext2D;
//   if (!ctx) {
//     return false;
//   }
//   const imageData = ctx.getImageData(0, 0, 1, 1);
//   // @ts-ignore
//   const colorSpace = imageData.colorSpace || '';
//   return colorSpace === 'display-p3';
// }
