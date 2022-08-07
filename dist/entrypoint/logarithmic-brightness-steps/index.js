import Colour from "../../Colour/Colour.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2, Vec3 } from "../../Vec.js";
const CANVAS_SIZE = 2048;
const stepsEl = document.querySelector('#steps');
const multipleEl = document.querySelector('#multiple');
const canvasEl = document.querySelector('canvas');
const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE / 4);
const state = {
    steps: 6,
    multiple: 0.5,
};
render();
const createSliderEventHandler = (propName) => {
    return (e) => {
        if (!e) {
            return;
        }
        state[propName] = Number(e.target.value);
        render();
    };
};
stepsEl.addEventListener('input', createSliderEventHandler('steps'));
multipleEl.addEventListener('input', createSliderEventHandler('multiple'));
function render() {
    canvasOutput.clear(true);
    drawSwatches(state.steps, state.multiple);
}
function drawSwatches(stepPower, multiple) {
    const stepCount = 2 ** stepPower;
    for (let swatchIndex = 0; swatchIndex < stepCount; swatchIndex++) {
        const sRGBBrightness = (swatchIndex / (stepCount - 1));
        const brightness = (swatchIndex / (stepCount - 1)) ** (1 / multiple);
        const width = 1 / stepCount;
        const offset = 1 - (width * (swatchIndex + 1));
        canvasOutput.drawRect({
            location: new Vec2(offset, 1),
            size: new Vec2(width, 0.5),
            color: new Colour(new Vec3(brightness, brightness, brightness), 'REC.709'),
        });
        canvasOutput.drawRect({
            location: new Vec2(offset, 0.5),
            size: new Vec2(width, 0.5),
            color: new Colour(new Vec3(sRGBBrightness, sRGBBrightness, sRGBBrightness), 'sRGB'),
        });
    }
}
