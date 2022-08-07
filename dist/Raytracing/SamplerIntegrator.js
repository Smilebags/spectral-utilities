import { lerp, nextFrame } from "../Util.js";
import { Vec2 } from "../Vec.js";
// http://www.pbr-book.org/3ed-2018/Introduction/Class%20Relationships.svg
export default class SamplerIntegrator {
    constructor(camera, sampler, sampleCount = 1, width = 30, height = 30) {
        this.camera = camera;
        this.sampler = sampler;
        this.sampleCount = sampleCount;
        this.width = width;
        this.height = height;
    }
    preprocess() { }
    async render(scene) {
        console.log('rendering');
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
    li(ray, scene) {
        const surfaceInteraction = scene.intersect(ray);
        return {
            sample() {
                return surfaceInteraction === null ? 0 : 1;
            }
        };
    }
    sampleSpectrum(raySpectrum) {
        const hero = Math.random();
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
