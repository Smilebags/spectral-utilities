import CanvasOutput from "./CanvasOutput.js";
import RenderEngine from "./RenderEngine.js";

const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl);
const renderEngine = new RenderEngine(canvasOutput);
renderEngine.render();