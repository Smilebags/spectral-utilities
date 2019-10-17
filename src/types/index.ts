export interface RenderContext {
  materialStore: MaterialStore;
  scene: Scene;
  camera: Camera;
  integrator: Integrator;
}

export interface Integrator {
  castRays(count: number): Ray[];
  sampleRays(rays: Ray[]): Sample[];
  binSamples(samples: Sample[]): PixelMap<Sample[]>;
  downsampleBin(bins: PixelMap<Sample[]>): PixelMap<Vec3>;
}

export interface PixelMap<T> {
  get(x: number, y: number): T;
}

export interface Sample {
  wavelength: number;
  intensity: number;
}

export interface Ray {
  pos: Vec3;
  dir: Vec3;
  dist: number;
}

export interface MaterialStore {
  get(name: string): Material;
}

export interface Material {
}

export interface Scene {
}

export interface Camera {
}

export interface Vec2 {
  x: number;
  y: number;
}
export interface Vec3 extends Vec2 {
  z: number;
}