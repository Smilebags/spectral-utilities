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

  static fromAverage(colours: Colour[]): Colour {
    const totalX = colours
      .map(colour => colour.triplet.x)
      .reduce((total, current) => total + current, 0);
    const totalY = colours
      .map(colour => colour.triplet.x)
      .reduce((total, current) => total + current, 0);
    const totalZ = colours
      .map(colour => colour.triplet.x)
      .reduce((total, current) => total + current, 0);
    return new Colour({
      x: totalX / colours.length,
      y: totalY / colours.length,
      z: totalZ / colours.length,
    }, colours[0].colourSpace);
  }

  multiply(colour: Colour | number): Colour {
    if (typeof colour === 'number') {
      return new Colour({
        x: this.triplet.x * colour,
        y: this.triplet.y * colour,
        z: this.triplet.z * colour,
      }, this.colourSpace);
    }
    return new Colour({
      x: this.triplet.x * colour.triplet.x,
      y: this.triplet.y * colour.triplet.y,
      z: this.triplet.z * colour.triplet.z,
    }, this.colourSpace);
  }

  toRec709(): Colour {
    if (this.colourSpace !== 'XYZ') {
      throw 'Not supported';
    }
    const tripletInRec709 = ColourConverter.xyzToRec709(this.triplet);
    return new Colour(tripletInRec709, 'REC.709');
  }
}