import { Vec2, Vec3 } from "../Vec.js";

export interface Radiance {
  wavelength: number;
  intensity: number;
}

export interface CameraSample {
  filmPos: Vec2;
  time: number;
  lensPos: Vec2;
}

export interface Integrator {
  render(scene: Scene): FrameBuffer<Vec3>;
}

export interface FrameBuffer<T> {
  get(x: number, y: number): T;
}

export interface Sampler {
  get1D(): number;
  get2D(): Vec2;
}

export interface Scene {
  intersect(ray: Ray): SurfaceInteraction | null;
}

export interface Primitive {
  // worldBound(): Vec3Bounds;
  intersect(ray: Ray): SurfaceInteraction | null;
}

export interface Hittable {
  intersect(ray: Ray): number | null;
}

export interface Material { }

export interface Vec3Bounds { }

export interface SurfaceInteraction { }

export interface Camera {
  getRay(cameraSample: CameraSample, pixel: Vec2): Ray;
  recordRadiances(radiances: Radiance[], sample: CameraSample, pixel: Vec2): void;
}

export interface Film {
  splat(radiances: Radiance[], sample: CameraSample, pixel: Vec2): void;
  getFilmPosition(pixel: Vec2, subpixelPosition: Vec2): Vec2;
}

export interface Ray {
  origin: Vec3;
  direction: Vec3;
  length: number | null;
  time: number;
}
