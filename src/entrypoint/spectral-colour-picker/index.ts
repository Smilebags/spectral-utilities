import { SpectralColourPicker } from "./SpectralColourPicker.js";
import CanvasOutput from "../../CanvasOutput.js";


const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl, 300, 300);
new SpectralColourPicker(canvasOutput);