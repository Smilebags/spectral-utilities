import { Vec3, Vec2 } from "./Vec.js";

export default class CanvasOutput {
  private context: CanvasRenderingContext2D;
  private imageData: ImageData;
  constructor(
    private canvasEl: HTMLCanvasElement,
    public width: number = 100,
    public height: number = 100,
    private gamma = 2.2,
  ) {
    this.canvasEl.height = height;
    this.canvasEl.width = width;
    this.context = this.canvasEl.getContext('2d')!;
    this.imageData = new ImageData(width, height);
    this.imageData.data.fill(255);
    this.redraw();
  }

  setPixel(color: Vec3, coords: Vec2) {
    const offset = ((coords.y * this.width) + coords.x) * 4;
    this.imageData.data[offset + 0] = (color.x ** (1 / this.gamma)) * 255;
    this.imageData.data[offset + 1] = (color.y ** (1 / this.gamma)) * 255;
    this.imageData.data[offset + 2] = (color.z ** (1 / this.gamma)) * 255;
  }

  redraw() {
    this.context.putImageData(this.imageData, 0, 0, 0, 0, this.width, this.height);
  }
}