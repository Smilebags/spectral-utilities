import { Vec3 } from "../Vec.js";
import { lerp } from "../Util.js";
import { wavelengthToXYZ2012 } from "./wavelengthToXYZ2012.js";
export default class ColourConverter {
    static tripletFromWavelength(wavelength) {
        return this.lerpVec3FromLookup(wavelengthToXYZ2012, wavelength);
    }
    static lerpVec3FromLookup(lookup, valueToFind) {
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
        return new Vec3(lerp(lowValue.x, highValue.x, mix), lerp(lowValue.y, highValue.y, mix), lerp(lowValue.z, highValue.z, mix));
    }
}
