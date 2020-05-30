import { Vec3 } from "./Vec.js";

import ColourConverter from "./ColourConverter.js";
import { clamp, lerp, mapValue } from "./Util.js";
import { Spectrum } from "./types/index.js";

export type ColourSpace = 'REC.709' | 'XYZ' | 'xyY';

export default class Colour {
  constructor(
    public triplet: Vec3,
    public colourSpace: ColourSpace = 'REC.709',
  ) {}

  static fromSpectrum(spectrum: Spectrum, resolution = 16, low = 360, high = 830): Colour {
    const samples = new Array(resolution).fill(null).map((item, index) => {
      const wavelength = mapValue(index, 0, resolution - 1, low, high);
      const intensity = spectrum.sample(wavelength);
      return Colour.fromWavelength(wavelength).multiply(intensity);
    });
    return Colour.fromAverage(samples);

  }

  static fromWavelength(wavelength: number): Colour {
    const triplet: Vec3 = ColourConverter.tripletFromWavelength(wavelength);
    return new Colour(triplet, 'XYZ');
  }

  static fromAverage(colours: Colour[]): Colour {
    const totalX = colours
      .map(colour => colour.triplet.x)
      .reduce((total, current) => total + current, 0);
    const totalY = colours
      .map(colour => colour.triplet.y)
      .reduce((total, current) => total + current, 0);
    const totalZ = colours
      .map(colour => colour.triplet.z)
      .reduce((total, current) => total + current, 0);
    return new Colour(new Vec3(
      totalX / colours.length,
      totalY / colours.length,
      totalZ / colours.length,
    ), colours[0].colourSpace);
  }

  multiply(colour: Colour | number): Colour {
    if (typeof colour === 'number') {
      return new Colour(new Vec3(
        this.triplet.x * colour,
        this.triplet.y * colour,
        this.triplet.z * colour,
      ), this.colourSpace);
    }
    return new Colour(new Vec3(
      this.triplet.x * colour.triplet.x,
      this.triplet.y * colour.triplet.y,
      this.triplet.z * colour.triplet.z,
    ), this.colourSpace);
  }

  add(colour: Colour): Colour {
    return new Colour(new Vec3(
      this.triplet.x + colour.triplet.x,
      this.triplet.y + colour.triplet.y,
      this.triplet.z + colour.triplet.z,
    ), this.colourSpace);
  }

  lerp(colour: Colour, mix: number): Colour {
    return new Colour(new Vec3(
      lerp(this.triplet.x, colour.triplet.x, mix),
      lerp(this.triplet.y, colour.triplet.y, mix),
      lerp(this.triplet.z, colour.triplet.z, mix),
    ), this.colourSpace);
  }

  normalise(): Colour {
    const max = Math.max(this.triplet.x, this.triplet.y, this.triplet.z);
    const triplet = new Vec3(
      this.triplet.x / max,
      this.triplet.y / max,
      this.triplet.z / max,
    );
    return new Colour(triplet, this.colourSpace);
  }

  get sum(): number {
    return this.triplet.x + this.triplet.y + this.triplet.z;
  }

  toxyY(): Colour {
    if (this.colourSpace !== 'XYZ') {
      throw 'Not supported';
    }
    const tripletInxyY = ColourConverter.xyzToxyY(this.triplet);
    return new Colour(tripletInxyY, 'xyY');
  }
  toRec709(): Colour {
    if (this.colourSpace == 'REC.709') {
      return this;
    }
    if (this.colourSpace !== 'XYZ') {
      throw 'Not supported';
    }
    const tripletInRec709 = ColourConverter.xyzToRec709(this.triplet);
    return new Colour(tripletInRec709, 'REC.709');
  }

  clamp(): Colour {
    this.triplet.x = clamp(this.triplet.x, 0, 1);
    this.triplet.y = clamp(this.triplet.y, 0, 1);
    this.triplet.z = clamp(this.triplet.z, 0, 1);
    return this;
  }
}