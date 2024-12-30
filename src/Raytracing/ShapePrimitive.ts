import { Primitive, SurfaceInteraction, Ray, Hittable, Material } from "./Types.js";

export default class ShapePrimitive implements Primitive {
  constructor(private shape: Hittable, material: Material) {}

  intersect(ray: Ray): SurfaceInteraction | null {
    const distance = this.shape.intersect(ray);
    if (distance === null) {
      return null;
    }
    return {}; // TODO return SurfaceInteraction
  }
}