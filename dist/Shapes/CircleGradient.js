import { Vec2 } from "../Vec.js";
import { mapValue } from "../Util.js";
export default class CircleGradient {
    constructor(callback, steps = 360, outerRadius = 1, innerRadius = 0.8, lineWidth = 0.02) {
        this.callback = callback;
        this.steps = steps;
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
        this.lineWidth = lineWidth;
    }
    render(ctx) {
        for (let i = 0; i < this.steps; i++) {
            const color = this.callback(i / this.steps);
            const x = mapValue(Math.sin((Math.PI * 2) * (i / this.steps)), -1, 1, 0, 1);
            const y = mapValue(Math.cos((Math.PI * 2) * (i / this.steps)), -1, 1, 0, 1);
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
