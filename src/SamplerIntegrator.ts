import { Camera, Scene, Ray, Spectrum, Radiance } from "./types/index.js";
import RandomSampler from "./RandomSampler.js";
import { lerp, nextFrame, mapValue } from "./Util.js";
import { Vec2 } from "./Vec.js";
import SPDSpectrum from "./SPDSpectrum.js";


const totalBounces = 20;



function parabolic(center: number, width: number, peak: number = 1) {
  return (sample: number) => {
    const distance = sample - center;
    const scaled = distance / width;
    return peak / (1 + (scaled **2));
  };
}
// http://www.pbr-book.org/3ed-2018/Introduction/Class%20Relationships.svg
export default class SamplerIntegrator {
  constructor(
    private camera: Camera,
    private sampler: RandomSampler,
    private sampleCount = 1,
  ) {}
  preprocess() {}

  async render(scene: Scene) {
    const [d65spd, aspd] = await Promise.all([
      fetch('/d65.spd').then(res => res.text()),
      fetch('/a.spd').then(res => res.text()),
    ]);
    const d65Illuminant = new SPDSpectrum(d65spd, 'zero', 0.2);
    const aIlluminant = new SPDSpectrum(aspd, 'zero', 0.2);
    const illuminants = [
      // {sample: (wavelength: number) => 2 ** 1},
      // {sample: (wavelength: number) => 2 ** 5},
      aIlluminant,
      d65Illuminant,
    ];
    const funkySpectrum: Spectrum = {
      sample: (wavelength: number) => {
        const progress = mapValue(wavelength, 380, 730, 0, 1);
        return 4 * ((progress - 0.5) ** 2);
      },
    };
    const smoothGreySpectrum: Spectrum = this.getGaussianSpectrum(550, 600, 0.5);
    const smoothGreenSpectrum: Spectrum = this.getGaussianSpectrum(550, 20, 0.8);
    const smoothPurpleSpectrum: Spectrum = this.getGaussianSpectrum(420, 60, 0.9);
    const smoothRedSpectrum: Spectrum = this.getGaussianSpectrum(720, 40, 0.95);
    const compositePurpleSpectrum: Spectrum = {
      sample: wavelength => parabolic(400, 50, 0.95)(wavelength) + parabolic(600, 20, 0.2)(wavelength)
    };
    const colourSpectrums = [
      // funkySpectrum,
      smoothGreySpectrum,
      compositePurpleSpectrum,
      smoothPurpleSpectrum,
      smoothRedSpectrum,
    ];
    for (let sampleIndex = 0; sampleIndex < this.sampleCount; sampleIndex++) {
      for (let y = 0; y < 100; y++) {
        const yProgress = y / 100;
        const numberOfBounces = Math.floor(yProgress * totalBounces) + 1;
        // const numberOfBounces = (yProgress * totalBounces) + 1;
        for (let x = 0; x < 100; x++) {
          const pixel = new Vec2(x, y);
          const colourWidth = 100 / colourSpectrums.length;
          const colourWidthProgress = (x % colourWidth) / colourWidth;
          const illuminantOption = Math.floor(colourWidthProgress * illuminants.length);
          const illuminant: Spectrum = illuminants[illuminantOption];
          const sample = this.sampler.getCameraSample();
          const colorSpectrum = colourSpectrums[Math.floor((x*colourSpectrums.length)/100)];
          const bouncedSpectrum: Spectrum = {
            sample: wavelength => (colorSpectrum.sample(wavelength) ** numberOfBounces) * illuminant.sample(wavelength),
          };
          const rayRadiances = this.sampleSpectrum(bouncedSpectrum);
          // // const cameraRay = this.camera.getRay(sample, pixel);
          // // const raySpectrum = this.li(cameraRay, scene);
          // const wavelength = lerp(380, 730, 1 - (x / 100));
          // const widthProgress = (1 / (1 - yProgress)) - 1;
          // const width = (widthProgress ** 4);
          this.camera.recordRadiances(rayRadiances, sample, pixel);
        }
        await nextFrame();
      }
    }
    // requestAnimationFrame(() => this.render(scene));
  }

  getGaussianSpectrum(center: number, width: number, peak: number = 2): Spectrum {
    return {
      sample: parabolic(center, width, peak),
    };
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
    // const wavelengths = [
    //   hero,
    //   (hero + 0.25) % 1,
    //   (hero + 0.5) % 1,
    //   (hero + 0.75) % 1,
    // ];
    const radiances = wavelengths.map((wavelength) => {
      return {
        wavelength: lerp(380, 730, wavelength),
        intensity: raySpectrum.sample(lerp(380, 730, wavelength)),
      };
    });
    return radiances;
    // sample the spectrum at x wavelengths based on configuration
    // and/or ray props and return the resultant radiances
  }
}