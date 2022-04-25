import Colour from "./Colour";

export class ChromaticAdaptation {
  constructor(
  ) { }

  adapt(colour: Colour, fromWhitePoint: Colour, toWhitePoint: Colour, maintainLuminosity: boolean = false) {
    const initialColourSpace = colour.colourSpace;
    const initialLuminosity = colour.to('xyY').triplet.z;
    const fromLms = fromWhitePoint.to('LMS');
    const toLms = toWhitePoint.to('LMS');
    const ratio = toLms.divide(fromLms);
    const colLms = colour.to('LMS');
    const adaptedLms = colLms.multiply(ratio);
    if (!maintainLuminosity) {
      return adaptedLms.to(initialColourSpace);
    }
    const adaptedColour = adaptedLms.to('xyY');
    adaptedColour.triplet.z = initialLuminosity;
    return adaptedColour.to(initialColourSpace);
  }
}