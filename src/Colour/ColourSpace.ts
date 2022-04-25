import { ColourSpaceName } from "../types/index.js";
import { ColourSpace } from "../types/index.js";
import { matrixMultiply } from "../Util.js";
import { Vec3 } from "../Vec.js";

export type Matrix = [[number,number,number],[number,number,number],[number,number,number]];

export default class GenericColourSpace implements ColourSpace {
  constructor(
    public name: ColourSpaceName,
    private toMatrix: Matrix,
    private fromMatrix: Matrix,
  ) {}

  // converts from xyz to this colour space
  to(colour: Vec3) {
    return Vec3.fromArray(matrixMultiply(this.toMatrix, colour.toArray()));
  }

  // converts from this colour space to xyz
  from(colour: Vec3) {
    return Vec3.fromArray(matrixMultiply(this.fromMatrix, colour.toArray()));
  }
}