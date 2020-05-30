import Colour from "../../Colour.js";
import { mapValue, logN } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2, Vec3 } from "../../Vec.js";
import { ParabolicSpectrum as InverseSquareSpectrum } from "../../Spectrum/ParabolicSpectrum.js";
import { WrappingParabolicSpectrum } from "../../Spectrum/WrappingParabolicSpectrum.js";
import { Spectrum } from "../../types/index.js";
import { GaussianSpectrum } from "../../Spectrum/GaussianSpectrum.js";

const WAVELENGTH_LOW = 360;
const WAVELENGTH_HIGH = 830;

const LOW_COLOR = Colour.fromWavelength(WAVELENGTH_LOW).normalise();
const HIGH_COLOR = Colour.fromWavelength(WAVELENGTH_HIGH).normalise();

const LOCUS_SAMPLES = 300;
const PINK_EDGE_SAMPLES = 40;
const DESATURATION_SAMPLES = 80;
const CANVAS_SIZE = 800;

const locusEl = document.querySelector('#locusWavelength') as HTMLInputElement;
const pinkProgressEl = document.querySelector('#pinkProgress') as HTMLInputElement;
const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl, CANVAS_SIZE, CANVAS_SIZE, false, 2.2, 0.18);
canvasOutput.clear(true);


const currentState = {
  locusWavelength: 550,
  currentPinkProgress: 50,
};
// const partFunction = (x: number) => (((((x**2) - (2 * x)) ** 0.5) - x + 1) ** (1/3));
// const inverseSmoothStep = (x: number) => partFunction(x) + 1 / (partFunction(x)) + 1;

const locusSamples = new Array(LOCUS_SAMPLES)
  .fill(null)
  .map(
    (item, index) => Colour.fromWavelength(
      mapValue((index / (LOCUS_SAMPLES - 1)), 0, 1, WAVELENGTH_LOW, WAVELENGTH_HIGH),
    ));

const pinkEdgeSamples = new Array(PINK_EDGE_SAMPLES)
  .fill(null)
  .map((item, index) => LOW_COLOR.lerp(
    HIGH_COLOR,
    mapValue(index, 0, PINK_EDGE_SAMPLES - 1, 0, 1) ** 0.5
  ));

const boundarySamples = [
  ...locusSamples,
  ...pinkEdgeSamples,
];

drawPoints(boundarySamples);


// function drawDot(point: Colour): void {
//   const xyYlocation = point.toxyY();
//   const location = new Vec2(xyYlocation.triplet.x, xyYlocation.triplet.y).add(0.1);
//   canvasOutput.drawCircle({
//     radius: 0.05,
//     location,
//     color: point,
//   });
// }

function drawPoints(points: Colour[]): void {
  points
    .map(point => {
      const xyYlocation = point.toxyY();
      const mappedLocation = new Vec2(xyYlocation.triplet.x, xyYlocation.triplet.y).add(0.1);
        // .add(new Vec2(0.2, 0.05))
        // .multiply(new Vec2(1, -1))
        // .add(new Vec2(0, 1))
        // .multiply(CANVAS_SIZE);
      // canvasOutput.setPixel(
      //   point.toRec709().triplet.normalise(),
      //   new Vec2(Math.round(mappedLocation.x), Math.round(mappedLocation.y)),
      // );
        return {
          location: mappedLocation,
          colour: point,
        };
    })
    .forEach(({location, colour}, index, arr) => {
      if (index === 0) {
        return;
      }
      // canvasOutput.drawCircle({
      //   radius: 0.003,
      //   location,
      //   color: colour,
      // });
      canvasOutput.drawLine({
        lineWidth: 0.005,
        from: arr[index - 1].location,
        to: location,
        color: colour,
      });
  });
}

const wavelengthRange = WAVELENGTH_HIGH - WAVELENGTH_LOW;
new Array(25)
  .fill(null)
  .forEach(
    (item, index) => {
      currentState.locusWavelength = mapValue(index, 0, 24, WAVELENGTH_LOW, WAVELENGTH_HIGH);
      currentState.currentPinkProgress = mapValue(index, 0, 24, 0, 100);
      renderDesaturationCurve();
    });


// locusEl.addEventListener('input', (e) => {
//   if (!e) {
//     return;
//   }
//   currentState.locusWavelength = Number((event!.target as HTMLInputElement).value);
//   renderDesaturationCurve();
// });
// pinkProgressEl.addEventListener('input', (e) => {
//   if (!e) {
//     return;
//   }
//   currentState.currentPinkProgress = Number((event!.target as HTMLInputElement).value);
//   renderDesaturationCurve();
// });

// renderDesaturationCurve();

type DesaturationStrategy = (wavelength: number, amount: number) => Colour;

function renderDesaturationCurve() {
  const locusWavelength = currentState.locusWavelength;
  console.log(locusWavelength);
  const pinkProgress = currentState.currentPinkProgress;
  
  const PinkLobeWideningStrategy = (
    progress: number,
    desaturationAmount: number,
  ) => {

    const width = mapValue(desaturationAmount ** 5, 0, 1, 0.01, 100);

    const blueColor = Colour.fromSpectrum(new GaussianSpectrum(
      WAVELENGTH_LOW,
      width * progress,
    ), 2 ** 8);
    // const blueColor = Colour.fromWavelength(WAVELENGTH_LOW);
    const blueEnergy = blueColor.sum;


    const redColor = Colour.fromSpectrum(new GaussianSpectrum(
      WAVELENGTH_HIGH,
      width * progress,
    ), 2 ** 8);
    // const redColor = Colour.fromWavelength(WAVELENGTH_HIGH);

    const redEnergy = redColor.sum;

    const scaledBlue = blueColor.multiply((blueEnergy + redEnergy) / blueEnergy);
    const scaledRed = redColor.multiply((blueEnergy + redEnergy) / redEnergy);
    // console.log(scaledBlue.lerp(scaledRed, progress / 100).triplet);
    return scaledBlue.lerp(scaledRed, progress / 100);

    // const attemptOne = lowColor.lerp(highColor, logN(1-(progress / 100), 3));
    // const attemptOne = lowColor.lerp(highColor, 1-(progress / 100));
    // const lum = attemptOne.toxyY().triplet.z;
    // return attemptOne.lerp(new Colour(new Vec3(lum, lum, lum),'XYZ'), desaturationAmount);

    // return lowColor.add(highColor.multiply(progress / 100));
  };

  const LobeWideningStrategy: DesaturationStrategy = (wavelength, amount) => {
    const width = mapValue(amount ** 3, 0, 1, 0.1, 300);
    const spectrum = new GaussianSpectrum(
      wavelength,
      width,
    );
    return Colour.fromSpectrum(spectrum, 2 ** 11);
  };

  const XYZLerpStrategy: DesaturationStrategy = (wavelength, amount) => {
    return Colour.fromWavelength(wavelength).lerp(new Colour(new Vec3(1, 1, 1)), amount ** 2);
  };

  // const OpposingLobeMixStrategy: DesaturationStrategy = (wavelength, amount) => {
  //   const width = mapValue(amount ** 3, 0, 1, 0.1, 300);
  //   const spectrum = new WrappingParabolicSpectrum(
  //     wavelength,
  //     width,
  //   );
  //   return Colour.fromSpectrum(spectrum, 2** 8);
  // };
  // const OpposingColourMixStrategy: DesaturationStrategy = (wavelength, amount) => {
  //   const width = mapValue(amount ** 3, 0, 1, 0.1, 300);
  //   const spectrum = new ParabolicSpectrum(
  //     wavelength,
  //     width,
  //   );

  //   return Colour.fromSpectrum(spectrum, 2 ** 8);
  // };

  const lobeDesaturationSamples = new Array(DESATURATION_SAMPLES)
    .fill(null)
    .map((item, index) => {
      const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1)
      return LobeWideningStrategy(locusWavelength, desaturationAmount);
    });
  const pinkDesaturationSamples = new Array(DESATURATION_SAMPLES)
    .fill(null)
    .map((item, index) => {
      const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1);
      return PinkLobeWideningStrategy(pinkProgress, desaturationAmount);
    });

  // const lerpDesaturationSamples = new Array(DESATURATION_SAMPLES)
  //   .fill(null)
  //   .map((item, index) => {
  //     const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1)
  //     return XYZLerpStrategy(locusWavelength, desaturationAmount);
  //   });
    
  // const mixedDesaturationSamples = new Array(DESATURATION_SAMPLES)
  //   .fill(null)
  //   .map((item, index) => {
  //     const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1)
  //     const xyz = XYZLerpStrategy(locusWavelength, desaturationAmount);
  //     const lobe = LobeWideningStrategy(locusWavelength, desaturationAmount);
  //     return xyz.lerp(lobe, 0.9);
  //   });

  // const opposingLobeMixSamples = new Array(DESATURATION_SAMPLES)
  // .fill(null)
  // .map((item, index) => {
  //   const desaturationAmount = mapValue(index, 0, DESATURATION_SAMPLES - 1, 0, 1)
  //   const xyz = XYZLerpStrategy(wavelength, desaturationAmount);
  //   const lobe = OpposingLobeMixStrategy(wavelength, desaturationAmount);
  //   return xyz.lerp(lobe, 0.9);
  // });

  drawPoints(boundarySamples);

  drawPoints(pinkDesaturationSamples);

  drawPoints(lobeDesaturationSamples);

  // drawPoints(lerpDesaturationSamples);
  // drawPoints(mixedDesaturationSamples);
}