import { Scene, Ray, SurfaceInteraction, Primitive } from "./Types.js";

export default class BasicScene implements Scene {
  constructor(private aggregate: Primitive) {}

  intersect(ray: Ray): SurfaceInteraction | null {
    return this.aggregate.intersect(ray);
  }
}