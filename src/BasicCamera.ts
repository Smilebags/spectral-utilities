import { Camera, Ray, Film, Radiance } from "./types/index.js";
import { Vec3 } from "./Vec.js";
import { CameraSample } from "./RandomSampler.js";

export default class BasicCamera implements Camera {
  constructor(
    private origin: Vec3,
    private direction: Vec3,
    private film: Film,  
  ) {}

  getRay(sample: CameraSample): Ray {
    const planeCenter = this.origin.add(this.direction);
    // get the sensor position based on the sample filmPos
    //   by interpolating from top left
    // get direction from origin to sensor pos
    return {
      origin: this.origin,
      direction: this.direction,
      time: 0,
      length: null,
    };
  }

  recordRadiances(radiances: Radiance[], sample: CameraSample) {
    this.film.splat(radiances, sample);
  }
}