import { mapValue, sleep } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2 } from "../../Vec.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";
const CLIP_OUT_OF_GAMUT = false;
const WAVELENGTH_LOW = 360;
const WAVELENGTH_HIGH = 830;
const CANVAS_SIZE = 1500;
const refineEl = document.querySelector('#refine');
const canvasEl = document.querySelector('canvas');
const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE, true);
const state = {
    desaturation: 1,
};
refineEl.addEventListener('click', () => {
    render(true);
});
render();
async function render(highQuality = false) {
    const SATURATION_SAMPLES = highQuality ? 240 : 220;
    for (let i = 0; i < SATURATION_SAMPLES; i++) {
        await sleep(1);
        state.desaturation = (i / (SATURATION_SAMPLES - 1)) ** 1.2;
        drawRing(highQuality);
    }
}
function drawRing(highQuality) {
    const HUE_SAMPLES = highQuality ? 720 : 120;
    const SPECTRUM_SAMPLE_SHIFT = highQuality ? 2 : 0;
    const gaussianWideningStrategy = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH);
    const points = createBoundaryValues(HUE_SAMPLES);
    const samplePoints = points.map((point, index, arr) => {
        const spectrumSamplePower = mapValue(state.desaturation ** 2, 0, 1, 6, 4) + SPECTRUM_SAMPLE_SHIFT;
        const spectrumSampleCount = Math.round(2 ** spectrumSamplePower);
        const colour = gaussianWideningStrategy.desaturate(point, state.desaturation, spectrumSampleCount).multiply(14);
        const progress = mapValue(index, 0, arr.length - 1, 0, Math.PI * 2);
        const radius = mapValue(state.desaturation, 0, 1, 1, 0);
        const location = new Vec2(Math.sin(progress) * radius, Math.cos(progress) * radius);
        return { colour, location };
    });
    drawPoints(samplePoints);
}
function createBoundaryValues(locusSampleCount) {
    return new Array(locusSampleCount)
        .fill(null)
        .map((item, index) => mapValue((index / (locusSampleCount - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH));
}
function drawPoints(points) {
    points
        .map(({ location, colour }) => {
        const mappedLocation = location.multiply(0.49).add(0.5);
        return {
            location: mappedLocation,
            colour,
        };
    })
        .forEach(({ location, colour }, index, arr) => {
        if (index === 0) {
            return;
        }
        if (isColourOutOfRec709Gamut(colour) && CLIP_OUT_OF_GAMUT) {
            return;
        }
        canvasOutput.drawLine({
            lineWidth: 0.003,
            from: arr[index - 1].location,
            to: location,
            color: colour,
        });
    });
}
function isColourOutOfRec709Gamut(colour) {
    const rec709Colour = colour.to('REC.709');
    return (rec709Colour.triplet.x >= 1 ||
        rec709Colour.triplet.y >= 1 ||
        rec709Colour.triplet.z >= 1 ||
        rec709Colour.triplet.x <= 0 ||
        rec709Colour.triplet.y <= 0 ||
        rec709Colour.triplet.z <= 0);
}
