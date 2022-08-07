import CanvasOutput from "../../CanvasOutput.js";
import SamplerIntegrator from "../../Raytracing/SamplerIntegrator.js";
import BasicCamera from "../../Raytracing/BasicCamera.js";
import RandomSampler from "../../Raytracing/RandomSampler.js";
import BasicFilm from "../../Raytracing/BasicFilm.js";
import { Vec3 } from "../../Vec.js";
import BasicScene from "../../Raytracing/BasicScene.js";
import BasicAggregate from "../../Raytracing/BasicAggregate.js";
import ShapePrimitive from "../../Raytracing/ShapePrimitive.js";
import BasicShape from "../../Raytracing/BasicShape.js";
const cameraPos = new Vec3(-0.8, 0, 0);
const cameraDir = new Vec3(-0.4, 0, 1).normalise();
const cameraUp = new Vec3(0, 1, 0);
const width = 50;
const height = 50;
const canvasEl = document.querySelector('canvas');
const canvasOutput = new CanvasOutput(canvasEl, width, height);
const film = new BasicFilm(canvasOutput, width, height);
const camera = new BasicCamera(cameraPos, cameraDir, cameraUp, film);
const sampler = new RandomSampler();
const vertices = [
    new Vec3(-0.5, -0.5, -2),
    new Vec3(-0.5, 0.5, -2),
    new Vec3(0.5, -0.5, -2),
    new Vec3(0.5, 0.5, -2),
];
const faces = [
    [0, 1, 2],
    [1, 2, 3],
];
const shape = new BasicShape(vertices, faces);
const shapePrimitive = new ShapePrimitive(shape, {});
const aggregate = new BasicAggregate([shapePrimitive]);
const scene = new BasicScene(aggregate);
const integrator = new SamplerIntegrator(camera, sampler, 2 ** 2, width, height);
integrator.render(scene);
// const testRay: Ray = {
//   origin: new Vec3(0, 0, 0),
//   direction: new Vec3(0, 0, -1),
//   length: null,
//   time: 0,
// };
// let testIntersection = shape.intersect(testRay);
// console.log(testIntersection);
// testRay.direction = new Vec3(10, 0, 1).normalise();
// testIntersection = shape.intersect(testRay);
// console.log(testIntersection);
