import { Spectrum } from "../../types/index.js";
import { Radiance } from "../../Raytracing/Types";
import { Camera } from "../../Raytracing/Types";
import { lerp, nextFrame } from "../../Util.js";
import { Vec2 } from "../../Vec.js";
import { CameraSample } from "../../Raytracing/Types";

export default class SelfReflectionViewer {
  constructor(
    private camera: Camera,
    private illuminants: Spectrum[],
    private colours: Spectrum[],
    private bounceCount: number,
    private patchWidth: number,
    private patchHeight: number,
  ) {}

  async render() {
    let workStartTime = Date.now();;
    for (let illuminantIndex = 0; illuminantIndex < this.illuminants.length; illuminantIndex++) {
      const illuminant = this.illuminants[illuminantIndex];
      for (let numberOfBounces = 1; numberOfBounces <= this.bounceCount; numberOfBounces++) {
        for (let colourIndex = 0; colourIndex < this.colours.length; colourIndex++) {
          const colorSpectrum = this.colours[colourIndex];
          const bouncedSpectrum: Spectrum = {
            sample: wavelength => (colorSpectrum.sample(wavelength) ** numberOfBounces) * illuminant.sample(wavelength),
          };
          const rayRadiances = this.sampleSpectrum(bouncedSpectrum);
          this.applyColourToRegion(illuminantIndex, colourIndex, numberOfBounces, rayRadiances);
        }
        if (Date.now() >= workStartTime + 60) {
          await nextFrame();
          workStartTime = Date.now();
        }
      }
    }
  }

  private applyColourToRegion(
    illuminantIndex: number,
    colourIndex: number,
    currentBounce: number,
    radiances: Radiance[],
  ) {
    const centerOfPixelSample = {filmPos: new Vec2(0.5, 0.5)} as CameraSample;

    const illuminantBlockOffset = illuminantIndex * this.bounceCount;
    const bounceBlockOffset = currentBounce - 1;
    // const topOffset = (colourBlockOffset + bounceBlockOffset) * this.patchHeight;
    // const leftOffset = illuminantIndex * this.patchWidth;
    const topOffset = colourIndex * this.patchHeight;
    const leftOffset = (illuminantBlockOffset + bounceBlockOffset) * this.patchWidth;
    const origin = new Vec2(leftOffset, topOffset);
    for (let x = 0; x < this.patchWidth; x++) {
      for (let y = 0; y < this.patchHeight; y++) {
        const filmCoordinate = origin.add(new Vec2(x, y));
        this.camera.recordRadiances(radiances, centerOfPixelSample, filmCoordinate);
      }
    }
  }

  private sampleSpectrum(raySpectrum: Spectrum): Radiance[] {
    const hero = 0;
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