// import { ChromaticAdaptation } from "../../Colour/ChromaticAdaptation.js";
// import Colour from "../../Colour/Colour.js";
// import { NormalisedCoefficientSpectrum } from "../../Spectrum/CoefficientSpectrum.js";
import Colour from "../../Colour/Colour.js";
import { SrgbSpectrum } from "../../Spectrum/sRGBSpectrum.js";
import { Spectrum } from "../../Spectrum/Spectrum.js";
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
const protanopiaButton = document.getElementById('protanopia') as HTMLButtonElement;
const deuteranomalyButton = document.getElementById('deuteranomaly') as HTMLButtonElement;
const deuteranopiaButton = document.getElementById('deuteranopia') as HTMLButtonElement;
const tritanopiaButton = document.getElementById('tritanopia') as HTMLButtonElement;

function setupObservers() {
  lSlider.addEventListener('input', redraw);
  mSlider.addEventListener('input', redraw);
  sSlider.addEventListener('input', redraw);
  resetButton.addEventListener('click', resetSliders);
  protanomalyButton.addEventListener('click', applyProtanomaly);
  protanopiaButton.addEventListener('click', applyProtanopia);
  deuteranomalyButton.addEventListener('click', applyDeuteranomaly);
  deuteranopiaButton.addEventListener('click', applyDeuteranopia);
  tritanopiaButton.addEventListener('click', applyTritanopia);
}

function resetSliders() {
  lSlider.value = '0';
  mSlider.value = '0';
  sSlider.value = '0';
  redraw();
}
function applyProtanomaly() {
  lSlider.value = '50';
  mSlider.value = '0';
  sSlider.value = '0';
  redraw();
}
function applyProtanopia() {
  lSlider.value = '100';
  mSlider.value = '0';
  sSlider.value = '0';
  redraw();
}
function applyDeuteranomaly() {
  lSlider.value = '0';
  mSlider.value = '50';
  sSlider.value = '0';
  redraw();
}
function applyDeuteranopia() {
  lSlider.value = '0';
  mSlider.value = '100';
  sSlider.value = '0';
  redraw();
}
function applyTritanopia() {
  lSlider.value = '0';
  mSlider.value = '0';
  sSlider.value = '100';
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
