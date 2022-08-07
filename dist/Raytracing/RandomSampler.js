import { Vec2 } from "../Vec.js";
export default class RandomSampler {
    constructor() {
        this.currentPixel = null;
        this.currentPixelSampleIndex = 0;
        this.array1DOffset = 0;
        this.array2DOffset = 0;
        this.samplesPerPixel = 16;
    }
    get2D() {
        return new Vec2(Math.random(), Math.random());
    }
    get1D() {
        return Math.random();
    }
    getCameraSample() {
        return {
            filmPos: this.get2D(),
            time: this.get1D(),
            lensPos: this.get2D(),
        };
    }
    startPixel(pixel) {
        this.currentPixel = pixel;
        this.currentPixelSampleIndex = 0;
        this.array1DOffset = 0;
        this.array2DOffset = 0;
    }
    startNextSample() {
        this.array1DOffset = 0;
        this.array2DOffset = 0;
        this.currentPixelSampleIndex += 1;
        return this.currentPixelSampleIndex < this.samplesPerPixel;
    }
    setSampleNumber(sampleNumber) {
        this.array1DOffset = 0;
        this.array2DOffset = 0;
        this.currentPixelSampleIndex = sampleNumber;
        return this.currentPixelSampleIndex < this.samplesPerPixel;
    }
}
