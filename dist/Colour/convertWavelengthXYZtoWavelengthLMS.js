import { Vec3 } from "../Vec.js";
import Colour from "./Colour.js";
import { wavelengthToXYZ2012 } from "./wavelengthToXYZ2012.js";
Vec3;
const prefix = `import { Vec3 } from "../Vec.js";

type Data = [wavelength: number, triplet: Vec3][];
export const wavelengthLMSLookup: Data = [`;
const suffix = `];
`;
const wavelengthLMSData = wavelengthToXYZ2012.map(item => {
    const wavelength = item[0];
    const XYZ = item[1];
    const colour = new Colour(XYZ, 'XYZ');
    const lmsTriplet = colour.to('LMS').triplet;
    const formatString = `[${wavelength}, new Vec3(${lmsTriplet.x}, ${lmsTriplet.y}, ${lmsTriplet.z})],`;
    return formatString;
});
console.log(prefix);
console.log(wavelengthLMSData.join('\n'));
console.log(suffix);
