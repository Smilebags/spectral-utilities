import CanvasOutput from "./CanvasOutput.js";
import RenderEngine from "./RenderEngine.js";
import SamplerIntegrator from "./SamplerIntegrator.js";
import BasicCamera from "./BasicCamera.js";
import RandomSampler from "./RandomSampler.js";
import { Scene } from "./types/index.js";
import BasicFilm from "./BasicFilm.js";

const cameraPos = {x: 0, y: 0, z: 0};
const cameraDir = {x: 0, y: 0, z: -1};

const canvasEl = document.querySelector('canvas')!;
const canvasOutput = new CanvasOutput(canvasEl);
const film = new BasicFilm(canvasOutput);
const camera = new BasicCamera(cameraPos, cameraDir, film);
const sampler = new RandomSampler();
const scene: Scene = {};
const integrator = new SamplerIntegrator(camera, sampler);
integrator.render(scene);
// const renderEngine = new RenderEngine(canvasOutput, integrator, scene);
// renderEngine.render();