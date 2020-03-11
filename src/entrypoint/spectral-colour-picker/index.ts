import { SpectralColourPicker } from "../../SpectralColourPicker.js";
import { mapValue } from "../../Util.js";


const canvasEl = document.querySelector('canvas')!;
const spectralColourPicker = new SpectralColourPicker(canvasEl);

const graphSize = 500;
const stepCount = 100;
const [low, high] = [360, 830];
const graphHeight = 2;

const graphCanvasEl = document.createElement('canvas')!;
graphCanvasEl.width = graphSize;
graphCanvasEl.height = graphSize;
const graphContext = graphCanvasEl.getContext('2d')!;
canvasEl.parentElement!.appendChild(graphCanvasEl);

function renderGraph() {
  graphContext.fillStyle = '#000000';
  graphContext.fillRect(0, 0, graphSize, graphSize);
  
  graphContext.strokeStyle = '#ffffff';
  graphContext.beginPath();
  for (let i = 0; i < stepCount; i++) {
    const progress = (i / (stepCount - 1));
    const wavelength = mapValue(progress, 0, 1, low, high);
    const value = spectralColourPicker.totalSpectrum.sample(wavelength);
    const y = graphSize * (1 - (value / graphHeight));
    if (i === 0) {
      graphContext.moveTo(0, y);
      continue;
    }
    const x = mapValue(i, 0, stepCount - 1, 0, graphSize);
    graphContext.lineTo(x, y);
  }
  graphContext.stroke();
  requestAnimationFrame(renderGraph);
};

renderGraph();