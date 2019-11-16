import { Camera, Scene, Ray, Spectrum, Radiance } from "./types/index.js";
import RandomSampler from "./RandomSampler.js";
import { lerp } from "./Util.js";
import { Vec2 } from "./Vec.js";

// http://www.pbr-book.org/3ed-2018/Introduction/Class%20Relationships.svg
export default class SamplerIntegrator {
  constructor(
    private camera: Camera,
    private sampler: RandomSampler,
    private sampleCount = 1,
  ) {}
  preprocess() {}

  render(scene: Scene) {

    for (let sampleIndex = 0; sampleIndex < this.sampleCount; sampleIndex++) {
      for (let y = 0; y < 100; y++) {
        for (let x = 0; x < 100; x++) {
          const pixel = new Vec2(x, y);
          const sample = this.sampler.getCameraSample();
          const cameraRay = this.camera.getRay(sample, pixel);
          const raySpectrum = this.li(cameraRay, scene);
          const rayRadiances = this.sampleSpectrum(raySpectrum);
          this.camera.recordRadiances(rayRadiances, sample, pixel);
        }
      }
    }
    // requestAnimationFrame(() => this.render(scene));
  }

  li(ray: Ray, scene: Scene): Spectrum {
    const surfaceInteraction = scene.intersect(ray);
    return {
      sample() {
        return surfaceInteraction === null ? 0 : 1;
      }
    }
  }

  sampleSpectrum(raySpectrum: Spectrum): Radiance[] {
    const hero = Math.random();
    const wavelengths = [
      hero,
      (hero + 0.25) % 1,
      (hero + 0.5) % 1,
      (hero + 0.75) % 1,
    ];
    const radiances = wavelengths.map((wavelength) => {
      return {
        wavelength: lerp(380, 730, wavelength),
        intensity: raySpectrum.sample(550),
      };
    });
    return radiances;
    // sample the spectrum at x wavelengths based on configuration
    // and/or ray props and return the resultant radiances
  }
}