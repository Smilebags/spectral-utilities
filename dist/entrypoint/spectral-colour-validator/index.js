import Colour from "../../Colour/Colour.js";
import { Vec3 } from "../../Vec.js";
const canvasElements = document.querySelectorAll('canvas');
canvasElements.forEach(el => process(el));
function process(el) {
    const [x, y, z] = el.dataset.triplet.split(',').map(Number);
    const colour = new Colour(new Vec3(x, y, z), el.dataset.colourspace);
    fillCanvasWithColour(el, colour);
}
function fillCanvasWithColour(canvasEl, colour) {
    const ctx = canvasEl.getContext('2d');
    ctx.fillStyle = colour.to('sRGB').hex;
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
}
