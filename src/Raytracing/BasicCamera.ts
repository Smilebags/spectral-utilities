import { Camera, Ray, Film, Radiance, CameraSample } from "./Types.js";
import { Vec3, Vec2 } from "../Vec.js";

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

  getRay(sample: CameraSample, pixel: Vec2): Ray {
    const filmPosition = this.film.getFilmPosition(pixel, sample.filmPos);
    const right = this.direction.cross(this.up);
    const up = right.cross(this.direction);
    // determine the center of the near plane
    const down = up.multiply(-1);
    
    const planeCenter = this.origin.add(this.direction.multiply(this.zoom));
    const topLeft = planeCenter
      .subtract(down.multiply(0.5))
      .subtract(right.multiply(0.5));
    const filmPos = topLeft
      .add(right.multiply(filmPosition.x))
      .add(down.multiply(filmPosition.y));

    const direction = filmPos.subtract(this.origin).normalise();
    return {
      origin: this.origin,
      direction,
      time: 0,
      length: null,
    };
  }

  recordRadiances(radiances: Radiance[], sample: CameraSample, pixel: Vec2) {
    this.film.splat(radiances, sample, pixel);
  }
}