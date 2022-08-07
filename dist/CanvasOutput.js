import { Vec3, Vec2 } from "./Vec.js";
import Colour from "./Colour/Colour.js";
const GREY = new Colour(new Vec3(0.5, 0.5, 0.5), 'XYZ');
const BLACK = new Colour(new Vec3(0.1, 0.1, 0.1), 'XYZ');
export default class CanvasOutput {
    constructor(canvasEl, width = 100, height = 100, clipOutOfGamut = false, targetSpace = 'sRGB', background = BLACK) {
        this.canvasEl = canvasEl;
        this.width = width;
        this.height = height;
        this.clipOutOfGamut = clipOutOfGamut;
        this.targetSpace = targetSpace;
        this.background = background;
        this.canvasEl.height = height;
        this.canvasEl.width = width;
        this.context = this.canvasEl.getContext('2d');
        this.imageData = new ImageData(width, height);
        this.clear();
        // setInterval(() => this.redraw(), 50);
    }
    setTargetSpace(space) {
        this.targetSpace = space;
    }
    drawLine(options) {
        const { lineWidth, from, to, color } = options;
        this.context.save();
        this.context.lineWidth = lineWidth * this.width;
        this.context.lineCap = 'round';
        const rgb = color.to(this.targetSpace).clamp();
        this.context.strokeStyle = rgb.hex;
        const canvasFrom = this.uvToCanvasCoordinates(from);
        const canvasTo = this.uvToCanvasCoordinates(to);
        this.context.beginPath();
        this.context.moveTo(canvasFrom.x, canvasFrom.y);
        this.context.lineTo(canvasTo.x, canvasTo.y);
        this.context.stroke();
        this.context.restore();
    }
    drawRect(options) {
        const { size, location, color } = options;
        this.context.save();
        const scaledLocation = this.uvToCanvasCoordinates(location);
        const scaledSize = this.uvToCanvasCoordinates(size);
        const rgb = color.to(this.targetSpace).clamp();
        this.context.fillStyle = rgb.hex;
        this.context.fillRect(scaledLocation.x, scaledLocation.y, scaledSize.x, scaledSize.y);
        this.context.restore();
    }
    drawCircle(options) {
        const { radius, location, color } = options;
        this.context.save();
        const rgb = color.to(this.targetSpace).clamp();
        this.context.fillStyle = rgb.hex;
        const canvasLocation = this.uvToCanvasCoordinates(location);
        const canvasRadius = radius * this.width;
        this.context.beginPath();
        this.context.arc(canvasLocation.x, canvasLocation.y, canvasRadius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    }
    uvToCanvasCoordinates(uv) {
        return new Vec2(uv.x * this.width, (1 - uv.y) * this.height);
    }
    clear(redraw = false) {
        const triplet = this.background.to(this.targetSpace).triplet;
        for (let i = 0; i < this.imageData.data.length; i += 4) {
            this.imageData.data[i] = Math.round(triplet.x * 255);
            this.imageData.data[i + 1] = Math.round(triplet.y * 255);
            this.imageData.data[i + 2] = Math.round(triplet.z * 255);
            this.imageData.data[i + 3] = 255;
        }
        if (redraw) {
            this.redraw();
        }
    }
    setPixel(colour, coords) {
        const triplet = colour.to(this.targetSpace).triplet;
        const offset = ((coords.y * this.width) + coords.x) * 4;
        if (this.clipOutOfGamut && (triplet.x > 1 ||
            triplet.y > 1 ||
            triplet.z > 1 ||
            triplet.x < 0 ||
            triplet.y < 0 ||
            triplet.z < 0)) {
            this.imageData.data[offset + 0] = 0;
            this.imageData.data[offset + 1] = 0;
            this.imageData.data[offset + 2] = 0;
            this.imageData.data[offset + 3] = 255;
            return;
        }
        this.imageData.data[offset + 0] = triplet.x * 255;
        this.imageData.data[offset + 1] = triplet.y * 255;
        this.imageData.data[offset + 2] = triplet.z * 255;
        this.imageData.data[offset + 3] = 255;
    }
    redraw() {
        this.context.putImageData(this.imageData, 0, 0, 0, 0, this.width, this.height);
    }
}
