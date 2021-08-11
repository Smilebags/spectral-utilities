This repository contains a collection of tools surrounding colour.
Entrypoints are the user-exposed applications which consume the core technology such as colour creation and manipulation and colour managed canvas rendering.

#[Documentation and live demos](https://smilebags.github.io/spectral-utilities/)

## Entrypoints
Here is a table of the current entrypoints in the repository.
- [3D LUT](./dist/entrypoint/3d-lut/README.md) - [Live Demo](./dist/entrypoint/3d-lut/)
- [Abney vs Gaussian Width](./dist/entrypoint/abney-vs-gaussian-width/README.md) - [Live Demo](./dist/entrypoint/abney-vs-gaussian-width/)
- [Gamut Mapping](./dist/entrypoint/gamut-mapping/README.md) - [Live Demo](./dist/entrypoint/gamut-mapping/)
- [Gaussian Width Desaturation Circle](./dist/entrypoint/gaussian-width-desaturation-circle/README.md) - [Live Demo](./dist/entrypoint/gaussian-width-desaturation-circle/)
- [Logarithmic Brightness Steps](./dist/entrypoint/logarithmic-brightness-steps/README.md) - [Live Demo](./dist/entrypoint/logarithmic-brightness-steps/)
- [Quadratic Sigmoid](./dist/entrypoint/quadratic-sigmoid/README.md) - [Live Demo](./dist/entrypoint/quadratic-sigmoid/)
- [Scene Renderer](./dist/entrypoint/scene-renderer/README.md) - [Live Demo](./dist/entrypoint/scene-renderer/)
- [Self Reflection Viewer](./dist/entrypoint/self-reflection-viewer/README.md) - [Live Demo](./dist/entrypoint/self-reflection-viewer/)
- [Spectral Colour Picker](./dist/entrypoint/spectral-colour-picker/README.md) - [Live Demo](./dist/entrypoint/spectral-colour-picker/)
- [Spectral Colour Validator](./dist/entrypoint/spectral-colour-validator/README.md) - [Live Demo](./dist/entrypoint/spectral-colour-validator/)
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