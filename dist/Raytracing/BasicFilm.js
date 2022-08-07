import { Vec2, Vec3 } from "../Vec.js";
import Colour from "../Colour/Colour.js";
import { mapValue } from "../Util.js";
export default class BasicFilm {
    constructor(output, width = 100, height = 100) {
        this.output = output;
        this.exposure = 1;
        this.bins = Array(this.output.width * this.output.height);
        this.xyzBuffer = Array(this.output.width * this.output.height);
        this.size = new Vec2(width, height);
        const exposureEl = document.createElement('input');
        exposureEl.type = 'range';
        exposureEl.value = '1';
        exposureEl.min = '0';
        exposureEl.max = '2';
        exposureEl.step = '0.001';
        exposureEl.style.width = '400px';
        exposureEl.style.display = 'block';
        exposureEl.addEventListener('input', (e) => {
            //@ts-ignore
            const exposureSliderPos = Number(e.target.value);
            const ev = mapValue(exposureSliderPos, 0, 2, -10, 10);
            this.exposure = 2 ** ev;
            this.repaint();
        });
        document.body.appendChild(exposureEl);
    }
    repaint() {
        this.bins.forEach((bin, index) => {
            this.updatePixel(index);
        });
    }
    coordsFromIndex(index) {
        const x = index % this.output.width;
        const y = Math.floor(index / this.output.width);
        return new Vec2(x, y);
    }
    getBinIndex(filmPos) {
        const xPos = Math.floor(filmPos.x * this.output.width);
        const yPos = Math.floor(filmPos.y * this.output.height);
        const index = (yPos * this.output.width) + xPos;
        this.bins[index] = this.bins[index] || [];
        return index;
    }
    getFilmPosition(pixel, subpixelPosition) {
        const totalPixelPosition = pixel.add(subpixelPosition);
        return totalPixelPosition.divide(this.size);
    }
    splat(radiances, sample, pixel) {
        const filmPos = this.getFilmPosition(pixel, sample.filmPos);
        const index = this.getBinIndex(filmPos);
        this.bins[index].push(...radiances);
        const xyzs = radiances.map(radiance => Colour
            .fromWavelength(radiance.wavelength)
            .multiply(radiance.intensity));
        const summedXyz = Colour.fromAverage(xyzs);
        this.xyzBuffer[index] = this.xyzBuffer[index] || new Colour(new Vec3(0, 0, 0), 'XYZ');
        this.xyzBuffer[index] = this.xyzBuffer[index].add(summedXyz);
        this.updatePixel(index);
    }
    updatePixel(index) {
        const binXYZs = this.bins[index]
            .map(radiance => Colour
            .fromWavelength(radiance.wavelength)
            .multiply(radiance.intensity));
        const averageColour = Colour.fromAverage(binXYZs);
        // const averageColour = this.xyzBuffer[index];
        const scaled = averageColour.multiply(this.exposure);
        this.output.setPixel(scaled, this.coordsFromIndex(index));
        this.output.redraw();
    }
}
