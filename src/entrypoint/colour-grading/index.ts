import Colour from "../../Colour/Colour.js";
import { clamp, lerp3, mapValue, sleep } from "../../Util.js";
import CanvasOutput from "../../CanvasOutput.js";
import { Vec2, Vec3 } from "../../Vec.js";
import GaussianWideningStrategy from "../../DesaturationStrategy/GaussianWideningStrategy.js";
import { ColourSpaceName } from "../../Colour/ColourSpace.js";



// const WAVELENGTH_LOW = 420;
// const WAVELENGTH_HIGH = 670;
// const SWATCH_WIDTH = 200;
// const STEP_COUNT = 20;
// const SWATCH_SIZE = SWATCH_WIDTH / STEP_COUNT;
// const WORKING_SPACE: ColourSpaceName = 'REC.709';

// const curveCanvasEl = document.querySelector('canvas#curve-swatch')! as HTMLCanvasElement;
// const abneyCanvasEl = document.querySelector('canvas#abney-swatch')! as HTMLCanvasElement;
// const swatchWavelengthEl = document.querySelector('#swatch-wavelength') as HTMLInputElement;
// let SWATCH_WAVELENGTH = Number(swatchWavelengthEl.value);

// swatchWavelengthEl.addEventListener('input', (e) => {
//   //@ts-ignore
//   SWATCH_WAVELENGTH = Number(e.target.value);
//   renderSwatches(SWATCH_WAVELENGTH);
// });

// const curveCanvasOutput = new CanvasOutput(
//   curveCanvasEl,
//   SWATCH_WIDTH,
//   10,
//   true,
//   'sRGB',
// );
// const abneyCanvasOutput = new CanvasOutput(
//   abneyCanvasEl,
//   SWATCH_WIDTH,
//   10,
//   true,
//   'sRGB',
// );
// const gaussianWideningStrategy = new GaussianWideningStrategy(WAVELENGTH_LOW, WAVELENGTH_HIGH);

// renderSwatches(Number(swatchWavelengthEl.value));

// function renderSwatches(wavelength: number) {
//   fillWavelengthDial(wavelength);
//   let startWidth = 0.016;
//   const startSearchStep = 0.003;
//   while(true) {
//     // TODO: Use ChromaticAdaptation
//     const colour = gaussianWideningStrategy.desaturate(wavelength, startWidth, 2 ** 7).to('XYZ');
//     colour.colourSpace = 'XYZ';
//     if (colour.to(WORKING_SPACE).allPositive) {
//       break;
//     }
//     startWidth += startSearchStep;
//   }
//   const startColour = gaussianWideningStrategy.desaturate(wavelength, startWidth, 2 ** 7);
//   renderCurveSwatches(wavelength, startWidth, curveCanvasOutput);
//   renderAbneySwatches(startColour, abneyCanvasOutput);
// }

// function fillWavelengthDial(wavelength: number) {
//   document.querySelector('#current-wavelength')!.innerHTML = String(wavelength);
// }


// function renderCurveSwatches(wavelength: number, startWidth: number, canvasOutput: CanvasOutput) {
//   for (let swatchIndex = 0; swatchIndex < STEP_COUNT; swatchIndex++) {
//     const mapped = mapValue(swatchIndex, 0, STEP_COUNT - 1, 0, 1);
//     const curveApplied = mapped ** 1.2;
//     const desaturation = mapValue(curveApplied, 0, 1, startWidth, 0.8);
//     // TODO: Use ChromaticAdaptation
//     const colour = gaussianWideningStrategy.desaturate(wavelength, desaturation, 2 ** 7).to('XYZ');
//     colour.colourSpace = 'XYZ';
//     for (let y = 0; y < SWATCH_SIZE; y++) {
//       for (let x = 0; x < SWATCH_SIZE; x++) {
//         canvasOutput.setPixel(
//           colour.to(WORKING_SPACE).normalise().multiply(0.9999),
//           new Vec2(x + (swatchIndex * SWATCH_SIZE), y));
//       }
//     }
//   }
//   canvasOutput.redraw();
// }

// function renderAbneySwatches(colour: Colour, canvasOutput: CanvasOutput) {
//   const destinationColour = new Colour(new Vec3(1,1,1), 'sRGB');
//   // TODO: Use ChromaticAdaptation
//   let startColour = colour.to('XYZ');
//   startColour.colourSpace = 'XYZ';
//   startColour = startColour.to('REC.709').normalise().to('sRGB');
//   for (let swatchIndex = 0; swatchIndex < STEP_COUNT; swatchIndex++) {
//     const mapped = mapValue(swatchIndex, 0, STEP_COUNT - 1, 0, 1);
//     const lerpedColour = startColour
//       .multiply(1-mapped)
//       .add(destinationColour.multiply(mapped));
//     if(swatchIndex === 10) {
//       console.log(startColour.hex);
//       // console.log(destinationColour.hex);
//       // console.log(lerpedColour.hex);
//     }
//     for (let y = 0; y < SWATCH_SIZE; y++) {
//       for (let x = 0; x < SWATCH_SIZE; x++) {
//         canvasOutput.setPixel(
//           lerpedColour.multiply(0.9999),
//           new Vec2((swatchIndex * SWATCH_SIZE) + x, y));
//       }
//     }
//   }
//   canvasOutput.redraw();
// }

// function steps(value: number, steps: number): number {
//   return Math.floor(value * steps) / steps;
// }


// smoothstep 0-1
function smoothStepNorm(x: number) {
  return -2 * Math.pow(x, 3) + 3 * Math.pow(x, 2);
}

const smoothStep = (
  start: number,
  end: number,
)  => (x: number) => {
  return smoothStepNorm(clamp(mapValue(x, start, end, 0, 1), 0, 1));
}



const radial = (innerRadius: number, outerRadius: number) => smoothStep(outerRadius, innerRadius);

const testFn = smoothStep(0, 1);
console.log(new Array(101).fill(null).map((_, i) => mapValue(i, 0, 100, -1, 2)).map((n) => [n, testFn(n)]));

const DOWNSCALE = 2;

async function main() {
  console.log('main');
  //@ts-ignore
  const fileInput: HTMLInputElement = document.getElementById('fileInput')!;
  //@ts-ignore
  const canvas: HTMLCanvasElement = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d')!;
  
  fileInput.addEventListener('change', async (event) => {
    console.log('change');
    //@ts-ignore
    const file = event.target.files[0];
    const bitmap = await createImageBitmap(file);
    canvas.width = bitmap.width / DOWNSCALE;
    canvas.height = bitmap.height / DOWNSCALE;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const invert = (space: ColourSpaceName) => (c: Colour) => {
      c = c.to(space);
      c.triplet = new Vec3(
        1 - c.triplet[0],
        1 - c.triplet[1],
        1 - c.triplet[2],
      );
      return c;
    };

    const offset = (amount: Vec3, space: ColourSpaceName) => (c: Colour) => {
      return c.to(space).add(new Colour(amount, space));
    };

    const scaleAround =  (s: number, origin: Vec3, space: ColourSpaceName) => (c: Colour) => {
      // TODO:
    };

    const radialMask = (origin: Vec3, radius: number, innerRadius = 0, space: ColourSpaceName = 'sRGB') => {
      const radiusFn = radial(innerRadius, radius);
      return (c: Colour) => {
        const length = c.to(space).triplet.subtract(origin).magnitude;
        return radiusFn(length);
    }
  }

    const applyMasked = (mask: (c: Colour) => number, transform: (c: Colour) => Colour, blendSpace: ColourSpaceName = 'sRGB') => (c: Colour) => {
      const original = c.copy();
      const maskValue = mask(c);
      const transformed = transform(c);
      const resultTriplet = lerp3(original.to(blendSpace).triplet, transformed.to(blendSpace).triplet, new Vec3(maskValue, maskValue, maskValue));
      return new Colour(resultTriplet, blendSpace);
    };

    const transforms: ((c: Colour) => Colour)[] = [
      // introduce red tone to shadows
      applyMasked(radialMask(new Vec3(0, 0, 0), 1), offset(new Vec3(0.05, 0, 0), 'REC.709'), 'REC.709'),
      // soft mask around white, shift cyan
      applyMasked(radialMask(new Vec3(1, 1, 1), 1), offset(new Vec3(-0.2, 0, 0), 'REC.709'), 'REC.709'),
      // precise mask around red primary, invert to cyan
      // applyMasked(radialMask(new Vec3(1, 0, 0), 0.5), invert('REC.709'), 'REC.709'),
    ];

    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const original = new Colour(new Vec3(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255), 'sRGB');
      
      const resultC = transforms.reduce((c, transform) => {
        return transform(c);
      }, original)
      
      const result = resultC.to('sRGB').triplet;
      
      // d[i] = mask * 255;
      // d[i + 1] = mask * 255;
      // d[i + 2] = mask * 255;

      d[i] = result[0] * 255;
      d[i + 1] = result[1] * 255;
      d[i + 2] = result[2] * 255;
    }
    ctx.putImageData(imageData, 0, 0);
    }
  );
}

main();