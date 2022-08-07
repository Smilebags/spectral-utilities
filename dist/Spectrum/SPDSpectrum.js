import { mapValue, lerp } from "../Util.js";
export default class SPDSpectrum {
    constructor(spdString, extendMode = 'zero', intensity = 1) {
        this.extendMode = extendMode;
        this.intensity = intensity;
        const lines = this.loadLines(spdString);
        const [header, ...entries] = lines;
        const { from, to } = this.parseHeader(header);
        this.from = from;
        this.to = to;
        this.entries = entries.map(Number);
    }
    get outOfRangeLow() {
        return this.extendMode === 'zero' ? 0 : this.entries[0];
    }
    get outOfRangeHigh() {
        const index = this.entries.length - 1;
        return this.extendMode === 'zero' ? 0 : this.entries[index];
    }
    sample(wavelength) {
        if (wavelength < this.from) {
            return this.outOfRangeLow * this.intensity;
        }
        if (wavelength === this.from) {
            return this.entries[0] * this.intensity;
        }
        if (wavelength > this.to) {
            return this.outOfRangeHigh * this.intensity;
        }
        if (wavelength === this.to) {
            const index = this.entries.length - 1;
            return this.entries[index] * this.intensity;
        }
        const progress = mapValue(wavelength, this.from, this.to, 0, 1);
        const positionInEntries = progress * (this.entries.length - 1);
        const lowIndex = Math.floor(positionInEntries);
        const highIndex = lowIndex + 1;
        const blendAmount = positionInEntries % 1;
        const lowValue = this.entries[lowIndex];
        const highValue = this.entries[highIndex];
        return lerp(lowValue, highValue, blendAmount) * this.intensity;
    }
    parseHeader(header) {
        const [from, to] = header.split('-');
        return {
            from: Number(from),
            to: Number(to),
        };
    }
    loadLines(file) {
        const lines = file.split('\n');
        return lines
            .map(this.removeCommentsAndPadding)
            .filter(line => line !== '');
    }
    removeCommentsAndPadding(line) {
        const beforeComment = line.split('#')[0];
        return beforeComment.trim();
    }
}
