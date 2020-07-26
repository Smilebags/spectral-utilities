import { Film, Radiance } from "./types/index.js";
import { Vec2, Vec3 } from "./Vec.js";
import CanvasOutput from "./CanvasOutput.js";
import { CameraSample } from "./RandomSampler.js";
import Colour from "./Colour/Colour.js";
import { mapValue } from "./Util.js";

export default class BasicFilm implements Film {
  private bins: Radiance[][] = Array(this.output.width * this.output.height);
  private xyzBuffer: Colour[] = Array(this.output.width * this.output.height)
  private size: Vec2;
  private exposure = 1;


  constructor(
    private output: CanvasOutput,
    width: number = 100,
    height: number = 100,
  ) {
    this.size = new Vec2(width, height);
    const exposureEl = document.createElement('input');
    exposureEl.type = 'range';
    exposureEl.value = '1';
    exposureEl.min = '0';
    exposureEl.max = '2';
    exposureEl.step = '0.001';
    exposureEl.style.width = '400px';
    exposureEl.style.display = 'block';
    exposureEl.addEventListener('input', (e) => {
      //@ts-ignore
      const exposureSliderPos = Number(e.target!.value);
      const ev = mapValue(exposureSliderPos, 0, 2, -10, 10);
      this.exposure = 2 ** ev;
      this.repaint();
    });
    document.body.appendChild(exposureEl);
  }

  private repaint() {
    this.bins.forEach((bin, index) => {
      this.updatePixel(index);
    });
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


    const xyzs = radiances.map(radiance => Colour
      .fromWavelength(radiance.wavelength)
      .multiply(radiance.intensity)
    );
    const summedXyz = Colour.fromAverage(xyzs);

    this.xyzBuffer[index] = this.xyzBuffer[index] || new Colour(new Vec3(0, 0, 0,), 'XYZ');
    this.xyzBuffer[index] = this.xyzBuffer[index].add(summedXyz);
    this.updatePixel(index);
  }

  updatePixel(index: number) {
    // const binXYZs = this.bins[index]
    //   .map(radiance => Colour
    //     .fromWavelength(radiance.wavelength)
    //     .multiply(radiance.intensity)
    //   );
    // const averageColour = Colour.fromAverage(binXYZs);
    const averageColour = this.xyzBuffer[index];
    const scaled = averageColour.multiply(this.exposure);
    const rgb = scaled.toRec709();
    this.output.setPixel(rgb.triplet, this.coordsFromIndex(index));
    // if (redraw) {
    //   this.output.redraw();
    // }
  }
}
