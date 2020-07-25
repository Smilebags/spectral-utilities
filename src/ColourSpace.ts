import { ColourSpaceName } from "./Colour.js";
import { ColourSpace } from "./types/index.js";
import { matrixMultiply } from "./Util.js";
import { Vec3 } from "./Vec.js";

export type Matrix = [[number,number,number],[number,number,number],[number,number,number]];

export default class GenericColourSpace implements ColourSpace {
  constructor(
    public name: ColourSpaceName,
    private toMatrix: Matrix,
    private fromMatrix: Matrix,
    private adaptationToMatrix?: Matrix,
    private adaptationFromMatrix?: Matrix,
  ) {}

  to(colour: Vec3) {
    if (!this.adaptationToMatrix) {
      return Vec3.fromArray(matrixMultiply(this.toMatrix, colour.toArray()));
    }
    const adapted = matrixMultiply(this.adaptationToMatrix, colour.toArray())
    return Vec3.fromArray(matrixMultiply(this.toMatrix, adapted));
  }

  from(colour: Vec3) {
    if (!this.adaptationFromMatrix) {
      return Vec3.fromArray(matrixMultiply(this.fromMatrix, colour.toArray()));
    }
    const adapted = matrixMultiply(this.adaptationFromMatrix, colour.toArray())
    return Vec3.fromArray(matrixMultiply(this.fromMatrix, adapted));
  }
}