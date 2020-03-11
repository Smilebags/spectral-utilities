import CanvasOutput from "../../CanvasOutput.js";
import BasicCamera from "../../BasicCamera.js";
import BasicFilm from "../../BasicFilm.js";
import { Vec3 } from "../../Vec.js";
import SelfReflectionViewer from "./SelfReflectionViewer.js";
import { Spectrum } from "../../types/index.js";
import { mapValue } from "../../Util.js";
import parabolic from "../../Spectrum/Parabolic.js";
import SPDSpectrum from "../../Spectrum/SPDSpectrum.js";

const cameraPos = new Vec3(0, 0, 0);
const cameraDir = new Vec3(0, 0, 1);
const cameraUp = new Vec3(0, 1, 0);

const numberOfLights = 3;
const numberofColours = 6;
const numberofBounces = 10;
const colourPatchHeight = 4;
const colourPatchWidth = 8;
const width = numberOfLights * colourPatchWidth;
const height = numberofColours * numberofBounces * colourPatchHeight;

const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl, width, height);
const film = new BasicFilm(canvasOutput, width, height);
const camera = new BasicCamera(
  cameraPos,
  cameraDir,
  cameraUp,
  film,
);

const getGaussianSpectrum = (center: number, width: number, peak: number = 2) => {
  return {
    sample: parabolic(center, width, peak),
  };
}

const funkySpectrum: Spectrum = {
  sample: (wavelength: number) => {
    const progress = mapValue(wavelength, 380, 730, 0, 1);
    return 4 * ((progress - 0.5) ** 2);
  },
};

const white: Spectrum = { sample: () => 0.8 };
const smoothGreenSpectrum: Spectrum = getGaussianSpectrum(550, 20, 0.8);
const smoothPurpleSpectrum: Spectrum = getGaussianSpectrum(420, 60, 0.9);
const smoothRedSpectrum: Spectrum = getGaussianSpectrum(700, 70, 0.99);
const compositePurpleSpectrum: Spectrum = {
  sample: (wavelength: number) => parabolic(400, 50, 0.95)(wavelength) + parabolic(600, 20, 0.2)(wavelength)
};

const colours = [
  white,
  smoothGreenSpectrum,
  compositePurpleSpectrum,
  smoothRedSpectrum,
  smoothPurpleSpectrum,
  funkySpectrum,
];

(async () => {

  const [d65spd, aspd] = await Promise.all([
    fetch('/static/d65.spd').then(res => res.text()),
    fetch('/static/a.spd').then(res => res.text()),
  ]);
  const d65Illuminant = new SPDSpectrum(d65spd, 'zero', 2 ** -5);
  const aIlluminant = new SPDSpectrum(aspd, 'zero', 2 ** -6);
  const blueLight: Spectrum = getGaussianSpectrum(450, 50, 2 ** 2);
  
  const illuminants = [
    d65Illuminant,
    aIlluminant,
    blueLight,
  ];

  const integrator = new SelfReflectionViewer(camera, illuminants, colours, numberofBounces, colourPatchWidth, colourPatchHeight);
  integrator.render();
})();
