import { Film, Radiance } from "./types/index.js";
import { Vec2 } from "./Vec.js";
import CanvasOutput from "./CanvasOutput.js";
import { CameraSample } from "./RandomSampler.js";
import Colour from "./Colour.js";

export default class BasicFilm implements Film {
  private bins: Radiance[][] = Array(this.output.width * this.output.height);
  private size: Vec2;
  constructor(
    private output: CanvasOutput,
    width: number = 100,
    height: number = 100,
  ) {
    this.size = new Vec2(width, height);
  }

  coordsFromIndex(index: number): Vec2 {
    const x = index % this.output.width;
    const y = Math.floor(index / this.output.width);
    return new Vec2(x, y);
  }

  getBinIndex(filmPos: Vec2): number {
    const xPos = Math.floor(filmPos.x * this.output.width);
    const yPos = Math.floor(filmPos.y * this.output.height);
    const index = (yPos * this.output.width) + xPos;
    this.bins[index] = this.bins[index] || [];
    return index;
  }

  getFilmPosition(pixel: Vec2, subpixelPosition: Vec2) {
    const totalPixelPosition = pixel.add(subpixelPosition);
    return totalPixelPosition.divide(this.size);
  }

  splat(radiances: Radiance[], sample: CameraSample, pixel: Vec2) {
    const filmPos = this.getFilmPosition(pixel, sample.filmPos);
    const index = this.getBinIndex(filmPos);
    this.bins[index].push(...radiances);
    this.updatePixel(index);
  }

  updatePixel(index: number) {
    const binXYZs = this.bins[index]
      .map(radiance => Colour
        .fromWavelength(radiance.wavelength)
        .multiply(radiance.intensity)
      );
    const averageColour = Colour.fromAverage(binXYZs);
    this.output.setPixel(averageColour.toRec709().triplet, this.coordsFromIndex(index));
    this.output.redraw();
  }
}
