import { Spectrum } from "../types/index";
import { Camera, Scene, Ray, Radiance } from "./Types";
import RandomSampler from "./RandomSampler.js";
import { lerp, nextFrame } from "../Util.js";
import { Vec2 } from "../Vec.js";

// http://www.pbr-book.org/3ed-2018/Introduction/Class%20Relationships.svg
export default class SamplerIntegrator {
  constructor(
    private camera: Camera,
    private sampler: RandomSampler,
    private sampleCount = 1,
    private width = 30,
    private height = 30,
  ) {}

  preprocess() {}

  async render(scene: Scene) {
    for (let sampleIndex = 0; sampleIndex < this.sampleCount; sampleIndex++) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const pixel = new Vec2(x, y);
          const sample = this.sampler.getCameraSample();
          const cameraRay = this.camera.getRay(sample, pixel);
          const raySpectrum = this.li(cameraRay, scene);
          const rayRadiances = this.sampleSpectrum(raySpectrum);
          this.camera.recordRadiances(rayRadiances, sample, pixel);
        }
        await nextFrame();
      }
    }
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
    const wavelengthCount = 2 ** 7;
    const wavelengths = [hero];
    for (let i = 1; i < wavelengthCount; i++) {
      wavelengths.push((hero + (i / wavelengthCount)) % 1)
    }
    const radiances = wavelengths.map((wavelength) => {
      return {
        wavelength: lerp(360, 830, wavelength),
        intensity: raySpectrum.sample(lerp(360, 830, wavelength)),
      };
    });
    return radiances;
  }
}