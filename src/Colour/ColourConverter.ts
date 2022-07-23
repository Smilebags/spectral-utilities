import { Vec3 } from "../Vec.js";
import { lerp } from "../Util.js";
import { wavelengthToXYZ2012 } from "./wavelengthToXYZ2012.js";

export type Vec3Lookup = [number, Vec3][];


export default class ColourConverter {
  static tripletFromWavelength(wavelength: number): Vec3 {
    return this.lerpVec3FromLookup(wavelengthToXYZ2012, wavelength);
  }

  static lerpVec3FromLookup(lookup: Vec3Lookup, valueToFind: number): Vec3 {
    if (valueToFind <= lookup[0][0]) {
      return lookup[0][1];
    }

    if (valueToFind >= lookup[lookup.length - 1][0]) {
      return lookup[lookup.length - 1][1];
    }

    const highIndex = lookup.findIndex(lookupItem => lookupItem[0] > valueToFind);
    const lowIndex = highIndex - 1;

    const lowLookupValue = lookup[lowIndex][0];
    const highLookupValue = lookup[highIndex][0];
    const difference = highLookupValue - lowLookupValue;
    const mix = (valueToFind - lowLookupValue) / difference;
    const lowValue = lookup[lowIndex][1];
    const highValue = lookup[highIndex][1];
    return new Vec3(
      lerp(lowValue.x, highValue.x, mix),
      lerp(lowValue.y, highValue.y, mix),
      lerp(lowValue.z, highValue.z, mix),
    );
  }

  // static xyzToRec709(xyz: Vec3, adapt = true): Vec3 {
  //   if (!adapt) {
  //     const red = (3.2404542 * xyz.x) + (-1.5371385 * xyz.y) + (-0.4985314 * xyz.z);
  //     const green = (-0.9692660 * xyz.x) + (1.8760108 * xyz.y) + (0.0415560 * xyz.z);
  //     const blue = (0.0556434 * xyz.x) + (-0.2040259 * xyz.y) + (1.0572252 * xyz.z);
  //     return new Vec3(red, green, blue);
  //   }

  //   const adaptedX = (0.9531874 * xyz.x) + (-0.0265906 * xyz.y) + (0.0238731 * xyz.z);
  //   const adaptedY = (-0.0382467 * xyz.x) + (1.0288406 * xyz.y) + (0.0094060 * xyz.z);
  //   const adaptedZ = (0.0026068 * xyz.x) + (-0.0030332 * xyz.y) + (1.0892565 * xyz.z);

  //   const red = (3.2404542 * adaptedX) + (-1.5371385 * adaptedY) + (-0.4985314 * adaptedZ);
  //   const green = (-0.9692660 * adaptedX) + (1.8760108 * adaptedY) + (0.0415560 * adaptedZ);
  //   const blue = (0.0556434 * adaptedX) + (-0.2040259 * adaptedY) + (1.0572252 * adaptedZ);
  //   return new Vec3(red, green, blue);
  // }

  // static xyzToxyY(xyz: Vec3): Vec3 {
  //   const x = xyz.x / (xyz.x + xyz.y + xyz.z);
  //   const y = xyz.y / (xyz.x + xyz.y + xyz.z);
  //   const Y = xyz.y;
  //   return new Vec3(x, y, Y);
  // }
}