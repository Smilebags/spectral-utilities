import CanvasOutput from "./CanvasOutput.js";
import Colour from "./Colour.js";
import { lerp } from "./Util.js";

export default class RenderEngine {
  constructor(private canvasOutput: CanvasOutput) {}
  render() {
    const base = {x: 0.5, y: 0.5, z: 0.5};
    for (let y = 0; y < this.canvasOutput.height; y++) {
      const mixLevel = y / this.canvasOutput.height;
      for (let x = 0; x < this.canvasOutput.width; x++) {
        const progress = x / this.canvasOutput.width;
        const wavelength = lerp(380, 730, progress);
        const colour = Colour.fromWavelength(wavelength);
        const recColour = colour.toRec709();
        const mixedColour = {
          x: lerp(recColour.triplet.x, base.x, mixLevel),
          y: lerp(recColour.triplet.y, base.y, mixLevel),
          z: lerp(recColour.triplet.z, base.z, mixLevel),
        };
        this.canvasOutput.setPixel(mixedColour, {x, y});
      }
    }
    this.canvasOutput.redraw();
  }
}