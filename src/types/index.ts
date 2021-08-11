import { Vec3 } from "../Vec.js";
import Colour from "../Colour/Colour";

export interface Spectrum {
  sample(wavelength: number): number;
}


export interface DesaturationStrategy {
  desaturate(wavelength: number, amount: number, integrationSampleCount: number): Colour;
}

export type ColourSpaceName =
  'REC.709' |
  'XYZ' |
  'XYZD65' |
  'xyY' |
  'sRGB' |
  'REC.2020' |
  'DCI-P3' |
  'lab' |
  'Display-P3';

export interface ColourSpace {
  name: ColourSpaceName;
  to(colour: Vec3): Vec3;
  from(colour: Vec3): Vec3;
}