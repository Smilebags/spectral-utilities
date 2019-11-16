import { Primitive, SurfaceInteraction, Ray, Shape, Material } from "./types/index";

export default class ShapePrimitive implements Primitive {
  constructor(private shape: Shape, material: Material) {}

  intersect(ray: Ray): SurfaceInteraction | null {
    const distance = this.shape.intersect(ray);
    if (distance === null) {
      return null;
    }
    return {}; // TODO return SurfaceInteraction
  }
}