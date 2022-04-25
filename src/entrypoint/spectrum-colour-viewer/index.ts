import { ChromaticAdaptation } from "../../Colour/ChromaticAdaptation.js";
import Colour from "../../Colour/Colour.js";
import { NormalisedCoefficientSpectrum } from "../../Spectrum/CoefficientSpectrum.js";
import { Spectrum } from "../../types/index.js";
import { mapValue } from "../../Util.js";
import { Vec3 } from "../../Vec.js";

const WAVELENGTH_LOW = 380;
const WAVELENGTH_HIGH = 730;

const scopeCanvas = document.getElementById("scope") as HTMLCanvasElement;
const colourCanvas = document.getElementById("colour") as HTMLCanvasElement;
const scopeContext = scopeCanvas.getContext("2d")!;
const colourContext = colourCanvas.getContext("2d")!;

const aEl = document.getElementById("a") as HTMLInputElement;
const bEl = document.getElementById("b") as HTMLInputElement;
const cEl = document.getElementById("c") as HTMLInputElement;

const ie = Colour.fromSpectrum({ sample: () => 1 });
const rec709White = new Colour(new Vec3(1, 1, 1), 'REC.709');

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
  let adapted = new ChromaticAdaptation().adapt(colour, ie, rec709White);
  ctx.fillStyle = adapted.sRGBHex;
  ctx.fillRect(0, 0, colourCanvas.width, colourCanvas.height);

  const rec = adapted.to('REC.709');
  const isInGamut = rec.allPositive;

  if (!isInGamut) {
    ctx.fillStyle = 'red';
    ctx.fillRect(colourCanvas.width - 40, colourCanvas.height - 40, 40, 40);
    ctx.canvas.title = 'Colour is out of gamut for sRGB';
  } else {
    ctx.canvas.title = 'Colour is in gamut';
  }
}

function renderScopeBackground(ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < ctx.canvas.width; i++) {
    const wavelength = mapValue(i, 0, ctx.canvas.width, WAVELENGTH_LOW, WAVELENGTH_HIGH);
    let colour = Colour.fromWavelength(wavelength).lerp(ie.multiply(0.5), 0.5);
    colour = new ChromaticAdaptation().adapt(colour, ie, rec709White, true);
    ctx.fillStyle = colour.sRGBHex;
    ctx.fillRect(i, 0, 1, ctx.canvas.height);
  }
}
