import { Camera, Ray, Film, Radiance } from "./types/index.js";
import { Vec3 } from "./Vec.js";
import { CameraSample } from "./RandomSampler.js";

export default class BasicCamera implements Camera {
  up: Vec3;
  direction: Vec3;
  constructor(
    private origin: Vec3,
    direction: Vec3,
    up: Vec3,
    private film: Film,  
    private zoom: number = 1,
  ) {
    this.up = up.normalise();
    this.direction = direction.normalise();
  }

  getRay(sample: CameraSample): Ray {
    const right = this.direction.cross(this.up);
    const up = right.cross(this.direction);
    // determine the center of the near plane
    const down = up.multiply(-1);
    
    const planeCenter = this.origin.add(this.direction.multiply(this.zoom));
    const topLeft = planeCenter
      .subtract(down.multiply(0.5))
      .subtract(right.multiply(0.5));
    const filmPos = topLeft
      .add(right.multiply(sample.filmPos.x))
      .add(down.multiply(sample.filmPos.y));

    const direction = filmPos.subtract(this.origin);
    return {
      origin: this.origin,
      direction,
      time: 0,
      length: null,
    };
  }

  recordRadiances(radiances: Radiance[], sample: CameraSample) {
    this.film.splat(radiances, sample);
  }
}