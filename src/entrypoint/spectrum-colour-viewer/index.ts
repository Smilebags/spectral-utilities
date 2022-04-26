import { ChromaticAdaptation } from "../../Colour/ChromaticAdaptation.js";
import Colour from "../../Colour/Colour.js";
import { NormalisedCoefficientSpectrum } from "../../Spectrum/CoefficientSpectrum.js";
import { Spectrum } from "../../types/index.js";
import { mapValue } from "../../Util.js";
import { Vec3 } from "../../Vec.js";

const getQueryParamValue = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

const CAN_USE_P3_CSS = typeof CSS.supports === 'function' && CSS.supports('color', 'color(display-p3 1 0 0)');
const CAN_USE_P3_CANVAS = checkP3CanvasSupport();
const CAN_USE_P3 = CAN_USE_P3_CANVAS;

const FORCE_USE_P3 = (getQueryParamValue('colorSpace') || '').toLowerCase() === 'p3';
const FORCE_USE_SRGB = (getQueryParamValue('colorSpace') || '').toLowerCase() === 'srgb';

const USE_P3 = FORCE_USE_SRGB ? false : CAN_USE_P3 || FORCE_USE_P3;
const USE_P3_IMAGEDATA_HACK = USE_P3 && !CAN_USE_P3_CSS;
const WAVELENGTH_LOW = 380;
const WAVELENGTH_HIGH = 730;

const config = {
  CAN_USE_P3_CSS,
  CAN_USE_P3_CANVAS,
  FORCE_USE_P3,
  FORCE_USE_SRGB,
  USE_P3,
  USE_P3_IMAGEDATA_HACK,
};
console.log(config);

const scopeCanvas = document.getElementById("scope") as HTMLCanvasElement;
const colourCanvas = document.getElementById("colour") as HTMLCanvasElement;

const options = { colorSpace: USE_P3 ? 'display-p3' : 'srgb' };

const scopeContext = scopeCanvas.getContext("2d", options)! as CanvasRenderingContext2D;
const colourContext: CanvasRenderingContext2D = colourCanvas.getContext("2d", options)! as CanvasRenderingContext2D;

const aEl = document.getElementById("a") as HTMLInputElement;
const bEl = document.getElementById("b") as HTMLInputElement;
const cEl = document.getElementById("c") as HTMLInputElement;

const ie = Colour.fromSpectrum({ sample: () => 1 });
const targetWhite = new Colour(new Vec3(1, 1, 1), USE_P3 ? 'DCI-P3' : 'REC.709');

setupListeners();

function setupListeners() {
  const redraw = () => {
    const a = parseFloat(aEl.value);
    const b = parseFloat(bEl.value);
    const c = parseFloat(cEl.value);
    render(scopeContext, colourContext, a, b, c);
  };
  aEl.addEventListener("input", redraw);
  bEl.addEventListener("input", redraw);
  cEl.addEventListener("input", redraw);
  redraw();
}

function render(
  scopeCtx: CanvasRenderingContext2D,
  colourCtx: CanvasRenderingContext2D,
  a: number,
  b: number,
  c: number,
) {
  const spectrum = new NormalisedCoefficientSpectrum(WAVELENGTH_LOW, WAVELENGTH_HIGH, a, b, c);
  renderColourScope(colourCtx, spectrum);

  scopeCtx.clearRect(0, 0, scopeCanvas.width, scopeCanvas.height);
  renderScopeBackground(scopeCtx);
  scopeCtx.strokeStyle = 'white';
  scopeCtx.lineWidth = 4;
  scopeCtx.beginPath();
  const x = 0;
  const y = mapValue(spectrum.sample(WAVELENGTH_LOW), 0, 1, scopeCanvas.height, 0);
  scopeCtx.moveTo(x, y);
  for (let i = WAVELENGTH_LOW; i <= WAVELENGTH_HIGH; i += 0.25) {
    const x = mapValue(i, WAVELENGTH_LOW, WAVELENGTH_HIGH, 0, scopeCanvas.width);
    const y = mapValue(spectrum.sample(i), 0, 1, scopeCanvas.height, 0);
    scopeCtx.lineTo(x, y);
  }
  scopeCtx.stroke();
}


function renderColourScope(ctx: CanvasRenderingContext2D, spectrum: Spectrum) {
  const colour = Colour.fromSpectrum(spectrum, 2 ** 9, WAVELENGTH_LOW, WAVELENGTH_HIGH);
  let adapted = new ChromaticAdaptation().adapt(colour, ie, targetWhite);
  if (USE_P3_IMAGEDATA_HACK) {
    drawP3RectUsingImageData(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, adapted);
  } else {
    ctx.fillStyle = USE_P3 ? adapted.cssP3ColorString : adapted.sRGBHex;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  const targetGamutColour = adapted.to(USE_P3 ? 'DCI-P3' : 'REC.709');
  const isInGamut = targetGamutColour.allPositive;

  if (!isInGamut) {
    if (USE_P3_IMAGEDATA_HACK) {
      drawP3RectUsingImageData(
        ctx,
        ctx.canvas.width - 40,
        ctx.canvas.height - 40,
        40,
        40,
        new Colour(new Vec3(1, 0, 0), 'Display-P3'),
      );
    } else {
      ctx.fillStyle = USE_P3 ? 'color(display-p3 1 0 0)' : 'red';
      ctx.fillRect(ctx.canvas.width - 40, ctx.canvas.height - 40, 40, 40);
    }
    ctx.canvas.title = 'Colour is out of gamut';
  } else {
    ctx.canvas.title = 'Colour is in gamut';
  }
}

function renderScopeBackground(ctx: CanvasRenderingContext2D) {
  let imageData: ImageData | null = null; 
  if (USE_P3_IMAGEDATA_HACK) {
    imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  for (let i = 0; i < ctx.canvas.width; i++) {
    const wavelength = mapValue(i, 0, ctx.canvas.width, WAVELENGTH_LOW, WAVELENGTH_HIGH);
    let colour = Colour.fromWavelength(wavelength).lerp(ie.multiply(0.5), 0.5);
    colour = new ChromaticAdaptation().adapt(colour, ie, targetWhite, true);
    if (USE_P3_IMAGEDATA_HACK && imageData) {
      assignRectToP3ImageData(imageData, i, 0, 1, ctx.canvas.height, colour);
    } else {
      ctx.fillStyle = USE_P3 ? colour.cssP3ColorString : colour.sRGBHex;
      ctx.fillRect(i, 0, 1, ctx.canvas.height);
    }
  }
  if (USE_P3_IMAGEDATA_HACK && imageData) {
    ctx.putImageData(imageData, 0, 0);
  }
}

function assignRectToP3ImageData(
  imageData: ImageData,
  xCoord: number,
  yCoord: number,
  width: number,
  height: number,
  colour: Colour,
) {
  const data = imageData.data;
  const { x: r, y: g, z: b } = colour.to('Display-P3').triplet;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const offset = ((j + yCoord) * imageData.width + (i + xCoord)) * 4;
      data[offset] = r * 255;
      data[offset + 1] = g * 255;
      data[offset + 2] = b * 255;
      data[offset + 3] = 255;
    }
  }
}

function drawP3RectUsingImageData(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colour: Colour,
) {
  const imageData = ctx.getImageData(x, y, width, height);
  assignRectToP3ImageData(imageData, 0, 0, width, height, colour);
  ctx.putImageData(imageData, x, y);
}

function checkP3CanvasSupport() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' })! as CanvasRenderingContext2D;
  if (!ctx) {
    return false;
  }
  const imageData = ctx.getImageData(0, 0, 1, 1);
  // @ts-ignore
  const colorSpace = imageData.colorSpace || '';
  return colorSpace === 'display-p3';
}
