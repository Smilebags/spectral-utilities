export default class Dot {
    constructor(callback, outerRadius = 1) {
        this.callback = callback;
        this.outerRadius = outerRadius;
    }
    render(ctx) {
        ctx.save();
        const col = this.callback();
        const rgb = col.to('REC.709').clamp().triplet;
        const rgbString = `rgb(${rgb.x * 255}, ${rgb.y * 255}, ${rgb.z * 255})`;
        ctx.fillStyle = rgbString;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, this.outerRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}
