import { CameraSample } from "./Types.js";
import { Sampler } from "./Types";
import { Vec2 } from "../Vec.js";

export default class RandomSampler implements Sampler {
  currentPixel: Vec2 | null = null;
  currentPixelSampleIndex: number = 0;
  array1DOffset: number = 0;
  array2DOffset: number = 0;
  samplesPerPixel: number = 16;

  get2D(): Vec2 {
    return new Vec2(Math.random(), Math.random());
  }
  get1D(): number {
    return Math.random();
  }
  getCameraSample(): CameraSample {
    return {
      filmPos: this.get2D(), // new Vec2(0.5, 0.5),//
      time: this.get1D(),
      lensPos: this.get2D(),
    };
  }

  startPixel(pixel: Vec2) {
    this.currentPixel = pixel;
    this.currentPixelSampleIndex = 0;
    this.array1DOffset = 0;
    this.array2DOffset = 0;
  }

  startNextSample() {
    this.array1DOffset = 0;
    this.array2DOffset = 0;
    this.currentPixelSampleIndex += 1;
    return this.currentPixelSampleIndex < this.samplesPerPixel;
  }

  setSampleNumber(sampleNumber: number) {
    this.array1DOffset = 0;
    this.array2DOffset = 0;
    this.currentPixelSampleIndex = sampleNumber;
    return this.currentPixelSampleIndex < this.samplesPerPixel;
  }
}