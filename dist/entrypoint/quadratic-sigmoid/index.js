import Colour from "../../Colour/Colour.js";
import { mapValue } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2 } from "../../Vec.js";
import QuadraticSigmoidSpectrum from "../../Spectrum/QuadraticSigmoidSpectrum.js";
const WAVELENGTH_LOW = 390;
const WAVELENGTH_HIGH = 830;
const LOW_COLOR = Colour.fromWavelength(WAVELENGTH_LOW).normalise();
const HIGH_COLOR = Colour.fromWavelength(WAVELENGTH_HIGH).normalise();
const LOCUS_SAMPLES = 300;
const PINK_EDGE_SAMPLES = 40;
const CANVAS_SIZE = 1000;
const midEl = document.querySelector('#mid');
const widthEl = document.querySelector('#width');
const sharpnessEl = document.querySelector('#sharpness');
const canvasEl = document.querySelector('canvas');
const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE);
const state = {
    wavelength: 500,
    width: 50,
    sharpness: 0.1,
};
const wavelengthSamples = arrayFromRange(80, WAVELENGTH_LOW, WAVELENGTH_HIGH);
const widthSamples = arrayFromRange(80, 1, 500);
const sharpnessSamples = arrayFromRange(80, -0.2, 0.2);
const boundarySamples = createBoundarySamples(LOCUS_SAMPLES, PINK_EDGE_SAMPLES);
render(true);
const createSliderEventHandler = (propName) => {
    return (e) => {
        if (!e) {
            return;
        }
        state[propName] = Number(e.target.value);
        render(true);
    };
};
midEl.addEventListener('input', createSliderEventHandler('wavelength'));
widthEl.addEventListener('input', createSliderEventHandler('width'));
sharpnessEl.addEventListener('input', createSliderEventHandler('sharpness'));
function render(clear = false) {
    if (clear) {
        canvasOutput.clear(true);
        drawPoints(boundarySamples);
    }
    renderActivePoint();
}
function arrayFromRange(length, low, high) {
    const range = high - low;
    const progress = (val) => val / (length - 1);
    return Array(length).fill(null).map((_, i) => low + progress(i) * range);
}
function renderActivePoint() {
    const spectrum = new QuadraticSigmoidSpectrum(state.wavelength, state.width, state.sharpness);
    const wavelengthVaryingLine = wavelengthSamples.map(wavelength => Colour.fromSpectrum(new QuadraticSigmoidSpectrum(wavelength, state.width, state.sharpness), 2 ** 8));
    const widthVaryingLine = widthSamples.map(width => Colour.fromSpectrum(new QuadraticSigmoidSpectrum(state.wavelength, width, state.sharpness), 2 ** 8));
    const sharpnessVaryingLine = sharpnessSamples.map(sharpness => Colour.fromSpectrum(new QuadraticSigmoidSpectrum(state.wavelength, state.width, sharpness), 2 ** 8));
    drawPoints(wavelengthVaryingLine);
    drawPoints(widthVaryingLine);
    drawPoints(sharpnessVaryingLine);
    drawDot(Colour.fromSpectrum(spectrum, 2 ** 8));
}
function createBoundarySamples(locusSampleCount, pinkEdgeSampleCount) {
    const locusSamples = new Array(locusSampleCount)
        .fill(null)
        .map((item, index) => Colour.fromWavelength(mapValue((index / (locusSampleCount - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH)));
    const pinkEdgeSamples = new Array(pinkEdgeSampleCount)
        .fill(null)
        .map((item, index) => LOW_COLOR.lerp(HIGH_COLOR, mapValue(index, 0, pinkEdgeSampleCount - 1, 0, 1) ** 0.5));
    return [
        ...locusSamples,
        ...pinkEdgeSamples,
    ];
}
function drawPoints(points) {
    points
        .map(point => {
        const xyYlocation = point.to('xyY');
        const mappedLocation = new Vec2(xyYlocation.triplet.x, xyYlocation.triplet.y).add(0.1);
        return {
            location: mappedLocation,
            colour: point,
        };
    })
        .forEach(({ location, colour }, index, arr) => {
        if (index === 0) {
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
function drawDot(point) {
    const xyYlocation = point.to('xyY');
    const mappedLocation = new Vec2(xyYlocation.triplet.x, xyYlocation.triplet.y).add(0.1);
    canvasOutput.drawCircle({
        radius: 0.008,
        location: mappedLocation,
        color: point,
    });
}
