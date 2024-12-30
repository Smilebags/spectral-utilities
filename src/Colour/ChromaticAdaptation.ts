import { Vec3 } from "../Vec.js";
import Colour from "./Colour.js";

export class ChromaticAdaptation {
  constructor(
  ) {}

  adapt(colour: Colour, fromWhitePoint: Colour, toWhitePoint: Colour, maintainLuminosity: boolean = false) {
    const initialColourSpace = colour.colourSpace;
    const fromLms = fromWhitePoint.to('LMS');
    const toLms = toWhitePoint.to('LMS');
    const ratio = toLms.divide(fromLms);
    // don't break when adapting, 
    // With this, the results won't look correct, but we won't get NaNs
    ratio.triplet = new Vec3(
      isFinite(ratio.triplet[0]) ? ratio.triplet[0] : 1000,
      isFinite(ratio.triplet[1]) ? ratio.triplet[1] : 1000,
      isFinite(ratio.triplet[2]) ? ratio.triplet[2] : 1000,
    )
    const colLms = colour.to('LMS');
    const adaptedLms = colLms.multiply(ratio);
    if (!maintainLuminosity) {
      return adaptedLms.to(initialColourSpace);
    }
    const adaptedColour = adaptedLms.to('xyY');
    const initialLuminosity = colour.to('xyY').triplet.z;
    adaptedColour.triplet.z = initialLuminosity;
    return adaptedColour.to(initialColourSpace);
  }
}