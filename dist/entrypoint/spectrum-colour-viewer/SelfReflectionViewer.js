import { lerp, nextFrame } from "../../Util.js";
import { Vec2 } from "../../Vec.js";
export default class SelfReflectionViewer {
    constructor(camera, illuminants, colours, bounceCount, patchWidth, patchHeight) {
        this.camera = camera;
        this.illuminants = illuminants;
        this.colours = colours;
        this.bounceCount = bounceCount;
        this.patchWidth = patchWidth;
        this.patchHeight = patchHeight;
    }
    async render() {
        let workStartTime = Date.now();
        ;
        for (let illuminantIndex = 0; illuminantIndex < this.illuminants.length; illuminantIndex++) {
            const illuminant = this.illuminants[illuminantIndex];
            for (let numberOfBounces = 1; numberOfBounces <= this.bounceCount; numberOfBounces++) {
                for (let colourIndex = 0; colourIndex < this.colours.length; colourIndex++) {
                    const colorSpectrum = this.colours[colourIndex];
                    const bouncedSpectrum = {
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
    applyColourToRegion(illuminantIndex, colourIndex, currentBounce, radiances) {
        const centerOfPixelSample = { filmPos: new Vec2(0.5, 0.5) };
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
    sampleSpectrum(raySpectrum) {
        const hero = 0;
        const wavelengthCount = 2 ** 7;
        const wavelengths = [hero];
        for (let i = 1; i < wavelengthCount; i++) {
            wavelengths.push((hero + (i / wavelengthCount)) % 1);
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
