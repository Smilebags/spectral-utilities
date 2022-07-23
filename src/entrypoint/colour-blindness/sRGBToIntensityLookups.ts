import { Spectrum } from "../../types";
import { lerp } from "../../Util.js";

const WAVELENGTH_LOW = 360;
const WAVELENGTH_HIGH = 830;
/* Rec709 RGB to wavelength intensities LUT. Range 360 - 830, step 5. */
const rec709_wavelength_lookup: number[][] = [
  [0.000902743, 0.000440162, 0.998533177],
  [0.000904961, 0.000380023, 0.998616619],
  [0.000910956, 0.000333280, 0.998679237],
  [0.000929552, 0.000288705, 0.998722748],
  [0.000948679, 0.000177288, 0.998800211],
  [0.001035677, 0.000081514, 0.998789905],
  [0.001172521, 0.000017206, 0.998713427],
  [0.001310703, 0.000001561, 0.998637909],
  [0.001458567, 0.000000654, 0.998455594],
  [0.001733331, 0.000000085, 0.998164365],
  [0.002095915, 0.000000000, 0.997896646],
  [0.002577116, 0.000000000, 0.997321487],
  [0.003201633, 0.000000000, 0.996730175],
  [0.004265045, 0.000000000, 0.995700589],
  [0.005920357, 0.000000000, 0.994063584],
  [0.008506606, 0.000000000, 0.991482264],
  [0.012443321, 0.000000000, 0.987517388],
  [0.018091684, 0.000000000, 0.981856793],
  [0.026042546, 0.000000000, 0.973856578],
  [0.036435460, 0.000000000, 0.962707910],
  [0.039899931, 0.021478954, 0.937650135],
  [0.035286134, 0.067640816, 0.896123859],
  [0.025361256, 0.134467863, 0.839298811],
  [0.013658174, 0.216312735, 0.769219525],
  [0.003834335, 0.307345736, 0.688087554],
  [0.000000000, 0.401523232, 0.598004484],
  [0.000000000, 0.496354267, 0.503380479],
  [0.000000000, 0.590572707, 0.409329548],
  [0.000000000, 0.681367728, 0.318629075],
  [0.000000000, 0.766235410, 0.233873901],
  [0.000000000, 0.842162175, 0.158131443],
  [0.000000000, 0.906067124, 0.094291632],
  [0.000000000, 0.955194216, 0.045290110],
  [0.000000000, 0.986988908, 0.013492779],
  [0.000000000, 1.000000000, 0.000219097],
  [0.000000000, 1.000000000, 0.000000000],
  [0.000000000, 1.000000000, 0.000000000],
  [0.000000000, 1.000000000, 0.000000000],
  [0.000000000, 1.000000000, 0.000000000],
  [0.000000000, 1.000000000, 0.000000000],
  [0.000000000, 0.999067127, 0.001246220],
  [0.005379110, 0.980188726, 0.013856898],
  [0.044486502, 0.932391013, 0.022648652],
  [0.111111509, 0.860799874, 0.027696770],
  [0.198844202, 0.771137366, 0.029718483],
  [0.300756170, 0.669781804, 0.029315467],
  [0.410294383, 0.562642966, 0.027020612],
  [0.520986174, 0.455607353, 0.023492681],
  [0.627185352, 0.353591880, 0.019379970],
  [0.724277585, 0.260824478, 0.015114317],
  [0.808674320, 0.180647965, 0.010966287],
  [0.878054831, 0.114912917, 0.007294643],
  [0.931326097, 0.064454707, 0.004495005],
  [0.968697501, 0.029231565, 0.002312563],
  [0.991084924, 0.008277483, 0.000815573],
  [0.999999185, 0.000000067, 0.000177461],
  [1.000000000, 0.000000000, 0.000105488],
  [0.999999999, 0.000000000, 0.000065311],
  [0.999999988, 0.000000000, 0.000034730],
  [0.999999951, 0.000000000, 0.000032384],
  [0.999999899, 0.000000004, 0.000012450],
  [0.999999811, 0.000000010, 0.000008285],
  [0.999998922, 0.000000025, 0.000012059],
  [0.999994021, 0.000000065, 0.000009153],
  [0.999954383, 0.000001134, 0.000017591],
  [0.999825195, 0.000001533, 0.000118782],
  [0.999618187, 0.000000940, 0.000328111],
  [0.999266581, 0.000009470, 0.000656578],
  [0.998698283, 0.000056448, 0.001165622],
  [0.998110564, 0.000126909, 0.001672347],
  [0.997422502, 0.000190122, 0.002293204],
  [0.996722868, 0.000264836, 0.002918298],
  [0.996045297, 0.000334667, 0.003566268],
  [0.995346684, 0.000413773, 0.004160554],
  [0.994758251, 0.000402274, 0.004733066],
  [0.994229251, 0.000416048, 0.005237258],
  [0.993734314, 0.000374198, 0.005787109],
  [0.993159673, 0.000365093, 0.006388126],
  [0.992616287, 0.000325574, 0.006948119],
  [0.992188458, 0.000295629, 0.007422253],
  [0.991881984, 0.000234628, 0.007818828],
  [0.991520838, 0.000197638, 0.008172359],
  [0.991180331, 0.000165582, 0.008563685],
  [0.990911501, 0.000138791, 0.008859408],
  [0.990713024, 0.000125697, 0.009061449],
  [0.990532233, 0.000116913, 0.009231764],
  [0.990404275, 0.000123074, 0.009393334],
  [0.990288023, 0.000144112, 0.009448200],
  [0.990183199, 0.000170483, 0.009528201],
  [0.990047857, 0.000161374, 0.009680004],
  [0.989915503, 0.000162754, 0.009828152],
  [0.989861003, 0.000137224, 0.009919195],
  [0.989851074, 0.000129580, 0.009904086],
  [0.989769619, 0.000167975, 0.009949906],
  [0.989627951, 0.000180551, 0.010106495],
];

const createSrgbChannelSpectrum = (channel: number) => ({
  sample(wavelength: number) {
    if (wavelength < WAVELENGTH_LOW || wavelength > WAVELENGTH_HIGH) {
      return 0;
    }
    const index = (wavelength - WAVELENGTH_LOW) / 5;
    const low = rec709_wavelength_lookup[Math.floor(index)][channel];
    const high = rec709_wavelength_lookup[Math.ceil(index)][channel];
    const progress = index % 1;
    return lerp(low, high, progress);
  }
});



export const sRGBToIntensityLookups: {
  r: Spectrum,
  g: Spectrum,
  b: Spectrum,
} = {
  r: createSrgbChannelSpectrum(0),
  g: createSrgbChannelSpectrum(1),
  b: createSrgbChannelSpectrum(2),
};
