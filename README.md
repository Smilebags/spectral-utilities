# Spectral Utilities
This repository contains a collection of tools surrounding colour.
Entrypoints are the user-exposed applications which consume the core technology such as colour creation and manipulation and colour managed canvas rendering.

## Entrypoints
Here is a table of the current entrypoints in the repository.
- [3D LUT](./entrypoint/3d-lut/README.md) - [Live Demo](./entrypoint/3d-lut/)
- [Abney vs Gaussian Width](./entrypoint/abney-vs-gaussian-width/README.md) - [Live Demo](./entrypoint/abney-vs-gaussian-width/)
- [Gamut Mapping](./entrypoint/gamut-mapping/README.md) - [Live Demo](./entrypoint/gamut-mapping/)
- [Gaussian Width Desaturation Circle](./entrypoint/gaussian-width-desaturation-circle/README.md) - [Live Demo](./entrypoint/gaussian-width-desaturation-circle/)
- [Logarithmic Brightness Steps](./entrypoint/logarithmic-brightness-steps/README.md) - [Live Demo](./entrypoint/logarithmic-brightness-steps/)
- [Quadratic Sigmoid](./entrypoint/quadratic-sigmoid/README.md) - [Live Demo](./entrypoint/quadratic-sigmoid/)
- [Scene Renderer](./entrypoint/scene-renderer/README.md) - [Live Demo](./entrypoint/scene-renderer/)
- [Self Reflection Viewer](./entrypoint/self-reflection-viewer/README.md) - [Live Demo](./entrypoint/self-reflection-viewer/)
- [Spectral Colour Picker](./entrypoint/spectral-colour-picker/README.md) - [Live Demo](./entrypoint/spectral-colour-picker/)
- [Spectral Colour Validator](./entrypoint/spectral-colour-validator/README.md) - [Live Demo](./entrypoint/spectral-colour-validator/)
## Usage
- Clone the repository

```
git clone git@github.com:Smilebags/spectral-utilities.git
```

- Install dependencies

```
npm i
```

- Copy `entrypoint/*/*.html` files to corresponding folder in `dist`
- Run the compiler in watch mode
```
npm run dev
```
- In another terminal window, serve the application
```
npm run serve
```