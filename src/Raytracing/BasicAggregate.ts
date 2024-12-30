import { Primitive, SurfaceInteraction, Ray } from "./Types.js";

export default class BasicAggregate implements Primitive {
  constructor(private primitives: Primitive[]) {}

  intersect(ray: Ray): SurfaceInteraction | null {
    let surfaceInteraction: SurfaceInteraction | null = null;
    for (let i = 0; i < this.primitives.length; i++) {
      const primitive = this.primitives[i];
      const interaction = primitive.intersect(ray);
      if (interaction === null) {
        continue;
      }
      surfaceInteraction = interaction;
    }
    return surfaceInteraction;
  }
}