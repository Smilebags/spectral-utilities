"use strict";
// import Colour from "./Colour";
// import fs from 'fs';
// import path from 'path';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';
// // import { Spectrum } from "../types";
// import { lerp} from "../Util";
// import { Vec3 } from "../Vec";
// const __dirname = dirname(fileURLToPath(import.meta.url));
// function loadFileContentsAsArray(filepath: string): number[] {
//     const file = fs.readFileSync(path.join(__dirname, filepath));
//     const lines = file.split('\n').filter((line: string) => line !== '').map(Number);
//     return lines;
// }
// const WAVELENGTH_HIGH = 830;
// const WAVELENGTH_LOW = 390;
// const WAVELENGTH_RANGE = WAVELENGTH_HIGH - WAVELENGTH_LOW;
// const l = loadFileContentsAsArray('CIE_L_390nm-830nm.txt');
// const m = loadFileContentsAsArray('CIE_L_390nm-830nm.txt');
// const s = loadFileContentsAsArray('CIE_L_390nm-830nm.txt');
// const createSpectrum = (data: number[], wavelengthOffset: number) => ({
//     sample(wavelength: number) {
//         const index = (wavelength + wavelengthOffset) - WAVELENGTH_LOW;
//         if (index < 0 || index > WAVELENGTH_RANGE) {
//             return 0;
//         }
//         const low = data[Math.floor(index)];
//         const high = data[Math.ceil(index)];
//         const progress = index % 1;
//         return lerp(low, high, progress);
//     },
// });
// const lSpectrum = createSpectrum(l, 0);
// const mSpectrum = createSpectrum(m, 0);
// const sSpectrum = createSpectrum(s, 0);
// export const colourScienceWavelengthToLMS = (wavelength: number): Colour => {
//     const lResponse = lSpectrum.sample(wavelength);
//     const mResponse = mSpectrum.sample(wavelength);
//     const sResponse = sSpectrum.sample(wavelength);
//     const response = new Vec3(
//         lResponse,
//         mResponse,
//         sResponse,
//     );
//     // for (let i = 0; i < sampleCount; i++) {
//     //     const progress = mapValue(1, 0, sampleCount - 1, 0, 1);
//     //     const wavelength = lerp(WAVELENGTH_LOW, WAVELENGTH_HIGH, progress);
//     //     const lResponse = lSpectrum.sample(wavelength);
//     //     const mResponse = mSpectrum.sample(wavelength);
//     //     const sResponse = sSpectrum.sample(wavelength);
//     //     accumulated.x += lResponse;
//     //     accumulated.y += mResponse;
//     //     accumulated.z += sResponse;
//     // }
//     return new Colour(response, 'LMS');
// }
