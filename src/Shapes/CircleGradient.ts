import Colour from "../Colour.js";

export default class CircleGradient {
  constructor(
    private callback: (phase: number) => Colour,
    private steps = 360,
    private outerRadius = 1,
    private innerRadius = 0.8,
    private lineWidth = 0.02,
  ) {}

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.lineWidth = this.lineWidth;
    for (let i = 0; i < this.steps; i++) {
      const col = this.callback(i / this.steps);
      const rgb = col.toRec709().clamp().triplet;
      const rgbString = `rgb(${rgb.x * 255}, ${rgb.y * 255}, ${rgb.z * 255})`;
      ctx.strokeStyle = rgbString;
      const x = Math.sin((Math.PI * 2) * (i / this.steps));
      const y = Math.cos((Math.PI * 2) * (i / this.steps));
      ctx.beginPath();
      ctx.moveTo(x * this.innerRadius, y * this.innerRadius);
      ctx.lineTo(x * this.outerRadius, y * this.outerRadius);
      ctx.stroke(); 
    }
    ctx.restore();
  }
}