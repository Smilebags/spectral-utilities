import CanvasOutput from "./CanvasOutput.js";
import Colour from "./Colour.js";
import { Integrator, Scene } from "./types/index.js";

export default class RenderEngine {
  constructor(
    private canvasOutput: CanvasOutput,
    private integrator: Integrator,
    private scene: Scene,
  ) {}
  render() {
    const frameBuffer = this.integrator.render(this.scene);
    for (let y = 0; y < this.canvasOutput.height; y++) {
      for (let x = 0; x < this.canvasOutput.width; x++) {
        const xyzColour = new Colour(frameBuffer.get(x, y), 'XYZ');
        const recColour = xyzColour.toRec709();
        this.canvasOutput.setPixel(recColour.triplet, {x, y});
      }
    }
    this.canvasOutput.redraw();
  }
}