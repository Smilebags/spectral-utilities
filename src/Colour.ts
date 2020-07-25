import { Vec3 } from "./Vec.js";

import ColourConverter from "./ColourConverter.js";
import { clamp, lerp, mapValue } from "./Util.js";
import { ColourSpaceName, Spectrum } from "./types/index.js";
import { ColourSpaceProvider } from "./ColourSpaceProvider";
import colourSpaceProviderSingleton from "./ColourSpaceProviderSingleton.js";

export default class Colour {

  constructor(
    public triplet: Vec3,
    public colourSpace: ColourSpaceName = 'REC.709',
    private colourSpaceProvider: ColourSpaceProvider,
  ) { }

  static fromSpectrum(spectrum: Spectrum, resolution = 2 ** 7, low = 400, high = 780): Colour {
    const samples = new Array(resolution).fill(null).map((item, index) => {
      const wavelength = mapValue(index, 0, resolution - 1, low, high);
      const intensity = spectrum.sample(wavelength);
      return Colour.fromWavelength(wavelength).multiply(intensity);
    });
    return Colour.fromAverage(samples);

  }

  static fromWavelength(wavelength: number): Colour {
    const triplet: Vec3 = ColourConverter.tripletFromWavelength(wavelength);
    return new Colour(triplet, 'XYZ', colourSpaceProviderSingleton);
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
    if (!totalX && !totalY && !totalZ) {
      return new Colour(new Vec3(0, 0, 0), colours[0].colourSpace, colourSpaceProviderSingleton);
    }
    return new Colour(
      new Vec3(
        totalX / colours.length,
        totalY / colours.length,
        totalZ / colours.length,
      ),
      colours[0].colourSpace,
      colourSpaceProviderSingleton,
    );
  }

  multiply(colour: Colour | number): Colour {
    if (typeof colour === 'number') {
      return new Colour(
        new Vec3(
          this.triplet.x * colour,
          this.triplet.y * colour,
          this.triplet.z * colour,
        ),
        this.colourSpace,
        this.colourSpaceProvider,
      );
    }
    return new Colour(
      new Vec3(
        this.triplet.x * colour.triplet.x,
        this.triplet.y * colour.triplet.y,
        this.triplet.z * colour.triplet.z,
      ),
      this.colourSpace,
      this.colourSpaceProvider,
    );
  }

  divide(colour: Colour | number): Colour {
    if (typeof colour === 'number') {
      return this.multiply(1 / colour);
    }
    return this.multiply(new Colour(
      new Vec3(
        1 / colour.triplet.x,
        1 / colour.triplet.y,
        1 / colour.triplet.z,
      ),
      colour.colourSpace,
      this.colourSpaceProvider,
    ));
  }

  add(colour: Colour): Colour {
    return new Colour(new Vec3(
      this.triplet.x + colour.triplet.x,
      this.triplet.y + colour.triplet.y,
      this.triplet.z + colour.triplet.z,
    ), this.colourSpace, this.colourSpaceProvider);
  }

  lerp(colour: Colour, mix: number): Colour {
    return new Colour(new Vec3(
      lerp(this.triplet.x, colour.triplet.x, mix),
      lerp(this.triplet.y, colour.triplet.y, mix),
      lerp(this.triplet.z, colour.triplet.z, mix),
    ), this.colourSpace, this.colourSpaceProvider);
  }

  normalise(): Colour {
    const max = Math.max(this.triplet.x, this.triplet.y, this.triplet.z);
    const triplet = new Vec3(
      this.triplet.x / max,
      this.triplet.y / max,
      this.triplet.z / max,
    );
    return new Colour(triplet, this.colourSpace, this.colourSpaceProvider);
  }

  get sum(): number {
    return this.triplet.x + this.triplet.y + this.triplet.z;
  }

  get allPositive(): boolean {
    return this.triplet.x >= 0 && this.triplet.y >= 0 && this.triplet.z >= 0;
  }

  to(colourSpace: ColourSpaceName): Colour {
    if (this.colourSpace === colourSpace) {
      return this;
    }

    const space = this.colourSpaceProvider.get(colourSpace);
    if (this.colourSpace === 'XYZ') {
      const triplet =  space.to(this.triplet);
      return new Colour(triplet, colourSpace, this.colourSpaceProvider);
    }

    const xyz = this.toXYZ();
    const triplet =  space.to(xyz.triplet);
    return new Colour(triplet, colourSpace, this.colourSpaceProvider);
  }

  private toXYZ(): Colour {
    if (this.colourSpace === 'XYZ') {
      return this;
    }
    const space = this.colourSpaceProvider.get(this.colourSpace);
    const triplet =  space.from(this.triplet);
    return new Colour(triplet, 'XYZ', this.colourSpaceProvider);

  }

  get hex(): string {
    const r = Math.round(clamp(this.triplet.x, 0, 1) * 255);
    const g = Math.round(clamp(this.triplet.y, 0, 1) * 255);
    const b = Math.round(clamp(this.triplet.z, 0, 1) * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  get sRGBHex(): string {
    const sRGBColour = this.to('sRGB');
    return sRGBColour.hex;
  }

  clamp(): Colour {
    this.triplet.x = clamp(this.triplet.x, 0, 1);
    this.triplet.y = clamp(this.triplet.y, 0, 1);
    this.triplet.z = clamp(this.triplet.z, 0, 1);
    return this;
  }
}