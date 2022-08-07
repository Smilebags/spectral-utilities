import { matrixMultiply } from "../Util.js";
import { Vec3 } from "../Vec.js";
export default class GenericColourSpace {
    constructor(name, toMatrix, fromMatrix) {
        this.name = name;
        this.toMatrix = toMatrix;
        this.fromMatrix = fromMatrix;
    }
    // converts from xyz to this colour space
    to(colour) {
        return Vec3.fromArray(matrixMultiply(this.toMatrix, colour.toArray()));
    }
    // converts from this colour space to xyz
    from(colour) {
        return Vec3.fromArray(matrixMultiply(this.fromMatrix, colour.toArray()));
    }
}
