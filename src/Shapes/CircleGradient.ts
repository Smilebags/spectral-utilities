import Colour from "../Colour/Colour.js";
import CanvasOutput from "../CanvasOutput.js";
import { Vec2 } from "../Vec.js";
import { mapValue } from "../Util.js";

export default class CircleGradient {
  constructor(
    private callback: (phase: number) => Colour,
    private steps = 360,
    private outerRadius = 1,
    private innerRadius = 0.8,
    private lineWidth = 0.02,
  ) {}

  render(ctx: CanvasOutput): void {
    for (let i = 0; i < this.steps; i++) {
      const color = this.callback(i / this.steps);
      const x = mapValue(
        Math.sin((Math.PI * 2) * (i / this.steps)),
        -1,
        1,
        0,
        1,
      );
      const y = mapValue(
        Math.cos((Math.PI * 2) * (i / this.steps)),
        -1,
        1,
        0,
        1,
      );
      const xy = new Vec2(x, y);

      const inner = xy.subtract(0.5).multiply(this.innerRadius).add(0.5);
      const outer = xy.subtract(0.5).multiply(this.outerRadius).add(0.5);
      ctx.drawLine({
        color,
        lineWidth: this.lineWidth,
        from: new Vec2(inner.x, inner.y),
        to: new Vec2(outer.x, outer.y),
      });
    }
  }
}