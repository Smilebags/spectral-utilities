import { CameraSample } from "../RandomSampler";
import { Vec2, Vec3 } from "../Vec.js";
import Colour from "../Colour";

export interface Integrator {
  render(scene: Scene): FrameBuffer<Vec3>
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
  // IntersectP(const Ray &r);
  // getMaterial(): Material;
  // ComputeScatteringFunctions(): SurfaceInteraction;
}

export interface Hittable {
  intersect(ray: Ray): number | null;
}

export interface Material {}

export interface Vec3Bounds {}

export interface SurfaceInteraction {}

export interface Camera {
  getRay(cameraSample: CameraSample, pixel: Vec2): Ray;
  recordRadiances(radiances: Radiance[], sample: CameraSample, pixel: Vec2): void;
}

export interface Film {
  splat(radiances: Radiance[], sample: CameraSample, pixel: Vec2): void;
  getFilmPosition(pixel: Vec2, subpixelPosition: Vec2): Vec2;
}

export interface Spectrum {
  sample(wavelength: number): number;
}

export interface Radiance {
  wavelength: number;
  intensity: number;
}

export interface Ray {
  origin: Vec3;
  direction: Vec3;
  length: number | null;
  time: number;
}



export interface DesaturationStrategy {
  desaturate(wavelength: number, amount: number, integrationSampleCount: number): Colour;
}

export type ColourSpaceName = 'REC.709' | 'XYZ' | 'xyY' | 'sRGB' | 'REC.2020' | 'DCI-P3';

export interface ColourSpace {
  name: ColourSpaceName;
  to(colour: Vec3): Vec3;
  from(colour: Vec3): Vec3;
}