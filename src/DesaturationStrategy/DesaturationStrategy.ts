import Colour from "../Colour/Colour";


export interface DesaturationStrategy {
  desaturate(wavelength: number, amount: number, integrationSampleCount: number): Colour;
}
