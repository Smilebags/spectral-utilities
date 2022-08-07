import Colour from "../../Colour/Colour.js";
import { arrayAverage, mapValue, sleep } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2 } from "../../Vec.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";
const WAVELENGTH_LOW = 390;
const WAVELENGTH_HIGH = 830;
const CANVAS_SIZE = 600;
const LOCUS_SAMPLES = 300;
const PINK_EDGE_SAMPLES = 40;
const SPECTRUM_SAMPLING_PRECISION = 2 ** 7;
const canvasEl = document.querySelector('canvas');
const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE);
const boundarySamples = createBoundarySamples(LOCUS_SAMPLES, PINK_EDGE_SAMPLES);
let fileString = 'wavelength, width, xyz sum, x, y, z\n';
(async () => {
    render(0.01, true);
    await sleep(1);
    render(0.02);
    await sleep(1);
    render(0.03);
    await sleep(1);
    render(0.04);
    await sleep(1);
    render(0.05);
    await sleep(1);
    render(0.06);
    await sleep(1);
    render(0.07);
    await sleep(1);
    render(0.08);
    await sleep(1);
    render(0.09);
    await sleep(1);
    render(0.10);
    await sleep(1);
    render(0.11);
    await sleep(1);
    render(0.12);
    await sleep(1);
    render(0.13);
    await sleep(1);
    render(0.14);
    await sleep(1);
    render(0.15);
    await sleep(1);
    render(0.16);
    await sleep(1);
    render(0.17);
    await sleep(1);
    render(0.18);
    await sleep(1);
    render(0.19);
    await sleep(1);
    render(0.20);
    for (let i = 0.02; i <= 0.2; i += 0.01) {
    }
    console.log(fileString);
    // await sleep(1);
    // render(0.1);
    // await sleep(1);
    // render(0.2);
    // await sleep(1);
    // render(0.3);
    // await sleep(1);
    // render(0.4);
    // await sleep(1);
    // render(0.5);
    // await sleep(1);
    // render(0.6);
    // await sleep(1);
    // render(0.7);
})();
function render(sum, clear = false) {
    if (clear) {
        canvasOutput.clear(true);
        drawPoints(boundarySamples);
    }
    const results = [];
    for (let wavelength = WAVELENGTH_LOW; wavelength <= WAVELENGTH_HIGH; wavelength += 1) {
        const result = findWidthForSum(wavelength, sum);
        const col = Colour.fromSpectrum(result.spectrum, SPECTRUM_SAMPLING_PRECISION, WAVELENGTH_LOW, WAVELENGTH_HIGH).to('XYZ');
        fileString += `${wavelength}, ${result.width}, ${sum}, ${col.triplet.x}, ${col.triplet.y}, ${col.triplet.z}\n`;
        results.push(result);
    }
    const colours = results.map(result => Colour.fromSpectrum(result.spectrum, SPECTRUM_SAMPLING_PRECISION, WAVELENGTH_LOW, WAVELENGTH_HIGH));
    colours.forEach(drawDot);
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
function createBoundarySamples(locusSampleCount, pinkEdgeSampleCount) {
    const locusSamples = new Array(locusSampleCount)
        .fill(null)
        .map((item, index) => Colour.fromWavelength(mapValue((index / (locusSampleCount - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH)));
    const LOW_COLOR = Colour.fromWavelength(WAVELENGTH_LOW);
    const HIGH_COLOR = Colour.fromWavelength(WAVELENGTH_HIGH);
    const pinkEdgeSamples = new Array(pinkEdgeSampleCount)
        .fill(null)
        .map((item, index) => LOW_COLOR.lerp(HIGH_COLOR, mapValue(index, 0, pinkEdgeSampleCount - 1, 0, 1) ** 0.5));
    return [
        ...locusSamples,
        ...pinkEdgeSamples,
    ];
}
function drawDot(point) {
    const xyYlocation = point.to('xyY');
    const location = new Vec2(xyYlocation.triplet.x, xyYlocation.triplet.y).add(0.1);
    canvasOutput.drawCircle({
        radius: 0.005,
        location,
        color: point,
    });
}
function xyzSum(spectrum) {
    const colour = Colour.fromSpectrum(spectrum, SPECTRUM_SAMPLING_PRECISION, WAVELENGTH_LOW, WAVELENGTH_HIGH);
    return colour.to('XYZ').sum;
}
function findWidthForSum(wavelength, desiredSum, precision = 0.0001, lowSearchBound = 0, highSearchBound = 1) {
    const width = arrayAverage([lowSearchBound, highSearchBound]);
    const guess = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH)
        .desaturateWithInfo(wavelength, width);
    // const guess = new GaussianSpectrum(wavelength, width);
    const sum = xyzSum(guess.spectrum);
    if (Math.abs(sum - desiredSum) <= precision) {
        return guess;
    }
    let newLowBound = lowSearchBound;
    let newHighBound = width;
    if (sum < desiredSum) {
        newLowBound = width;
        newHighBound = highSearchBound;
    }
    return findWidthForSum(wavelength, desiredSum, precision, newLowBound, newHighBound);
}
