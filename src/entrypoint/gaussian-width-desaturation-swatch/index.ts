import { Vec2 } from "../../Vec.js";
import CanvasOutput from "../../CanvasOutput.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";
import { mapValue } from "../../Util.js";

const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl, 200, 10, false, 2.2, 0.18);

const gaussianWideningStrategy = new GaussianWideningStrategy(390, 830);
const exposure = 2;
render();
function render() {
  for (let i = 0; i < 200; i++) {
    const wavelength = 400;
    const stepCount = 10;
    const start = 0.45;
    const mapped = mapValue(i, 0, 200, 0, 1);
    const stepped = steps(mapped, stepCount);
    const desaturation = mapValue(stepped, 0, 1, start, 1);
    const colour = gaussianWideningStrategy.desaturate(wavelength, desaturation, 2 ** 7).multiply(exposure);
    for (let j = 0; j < 10; j++) {
      canvasOutput.setPixel(colour.to('REC.709').triplet, new Vec2(i, j));
    }
  }
}

function steps(value: number, steps: number): number {
  return Math.floor(value * steps) / steps;
}