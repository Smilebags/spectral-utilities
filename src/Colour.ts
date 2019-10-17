import { Vec3 } from "./types/index.js";
import ColourConverter from "./ColourConverter.js";

export type ColourSpace = 'REC.709' | 'XYZ';

export default class Colour {
  constructor(
    public triplet: Vec3,
    public colourSpace: ColourSpace = 'REC.709',
  ) {}

  static fromWavelength(wavelength: number): Colour {
    const triplet: Vec3 = ColourConverter.tripletFromWavelength(wavelength);
    return new Colour(triplet, 'XYZ');
  }

  toRec709(): Colour {
    if (this.colourSpace !== 'XYZ') {
      throw 'Not supported';
    }
    const tripletInRec709 = ColourConverter.xyzToRec709(this.triplet);
    return new Colour(tripletInRec709, 'REC.709');
  }
}