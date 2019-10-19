import { Camera, Scene, Ray, Spectrum, Radiance } from "./types/index.js";
import RandomSampler from "./RandomSampler.js";
import { lerp } from "./Util.js";

// http://www.pbr-book.org/3ed-2018/Introduction/Class%20Relationships.svg
export default class SamplerIntegrator {
  constructor(
    private camera: Camera,
    private sampler: RandomSampler,
  ) {}
  preprocess() {}

  render(scene: Scene) {
    for (let y = 0; y < 200; y++) {
      for (let x = 0; x < 200; x++) {
        const sample = this.sampler.getCameraSample();
        const cameraRay = this.camera.getRay(sample);
        const raySpectrum = this.li(cameraRay);
        const rayRadiances = this.sampleSpectrum(raySpectrum);
        this.camera.recordRadiances(rayRadiances, sample);
      }
    }
    // requestAnimationFrame(() => this.render(scene));
  }

  li(ray: Ray): Spectrum {
    return {
      sample() {
        return ray.direction.x;
      }
    }
    // trace the ray through the scene and get all the interactions
    // return the spectrum returned by the first interaction's material?
  }

  sampleSpectrum(raySpectrum: Spectrum): Radiance[] {
    return [{
      wavelength: lerp(380, 730, raySpectrum.sample(550)),
      intensity: 1,
    }];
    // sample the spectrum at x wavelengths based on configuration
    // and/or ray props and return the resultant radiances
  }
}