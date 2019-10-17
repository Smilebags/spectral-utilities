import { Vec3 } from "./types/index.js";
import { lerp } from "./Util.js";

type Vec3Lookup = [number, Vec3][];

export default class ColourConverter {
  static tripletFromWavelength(wavelength: number): Vec3 {
    return this.lerpVec3FromLookup(ColourConverter.wavelengthToXYZ, wavelength);
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
    return {
      x: lerp(lowValue.x, highValue.x, mix),
      y: lerp(lowValue.y, highValue.y, mix),
      z: lerp(lowValue.z, highValue.z, mix),
    }
  }

  static xyzToRec709(xyz: Vec3): Vec3 {
    const red   = (3.2404542 * xyz.x) + (-1.5371385 * xyz.y) + (-0.4985314 * xyz.z);
    const green = (-0.969266 * xyz.x) + (1.87601080 * xyz.y) + (0.04155600 * xyz.z);
    const blue  = (0.0556434 * xyz.x) + (-0.2040259 * xyz.y) + (1.05722520 * xyz.z);
    return {x: red, y: green, z: blue};
}

  static wavelengthToXYZ: Vec3Lookup = [
    [380.0, {x: 0.0014, y: 0.0000, z: 0.0065}],
    [381.0, {x: 0.0015, y: 0.0000, z: 0.0070}],
    [382.0, {x: 0.0016, y: 0.0000, z: 0.0077}],
    [383.0, {x: 0.0018, y: 0.0001, z: 0.0085}],
    [384.0, {x: 0.0020, y: 0.0001, z: 0.0094}],
    [385.0, {x: 0.0022, y: 0.0001, z: 0.0105}],
    [386.0, {x: 0.0025, y: 0.0001, z: 0.0120}],
    [387.0, {x: 0.0029, y: 0.0001, z: 0.0136}],
    [388.0, {x: 0.0033, y: 0.0001, z: 0.0155}],
    [389.0, {x: 0.0037, y: 0.0001, z: 0.0177}],
    [390.0, {x: 0.0042, y: 0.0001, z: 0.0201}],
    [391.0, {x: 0.0048, y: 0.0001, z: 0.0225}],
    [392.0, {x: 0.0053, y: 0.0002, z: 0.0252}],
    [393.0, {x: 0.0060, y: 0.0002, z: 0.0284}],
    [394.0, {x: 0.0068, y: 0.0002, z: 0.0320}],
    [395.0, {x: 0.0077, y: 0.0002, z: 0.0362}],
    [396.0, {x: 0.0088, y: 0.0002, z: 0.0415}],
    [397.0, {x: 0.0100, y: 0.0003, z: 0.0473}],
    [398.0, {x: 0.0113, y: 0.0003, z: 0.0536}],
    [399.0, {x: 0.0128, y: 0.0004, z: 0.0605}],
    [400.0, {x: 0.0143, y: 0.0004, z: 0.0679}],
    [401.0, {x: 0.0156, y: 0.0004, z: 0.0741}],
    [402.0, {x: 0.0171, y: 0.0005, z: 0.0810}],
    [403.0, {x: 0.0188, y: 0.0005, z: 0.0891}],
    [404.0, {x: 0.0208, y: 0.0006, z: 0.0988}],
    [405.0, {x: 0.0232, y: 0.0006, z: 0.1102}],
    [406.0, {x: 0.0263, y: 0.0007, z: 0.1249}],
    [407.0, {x: 0.0298, y: 0.0008, z: 0.1418}],
    [408.0, {x: 0.0339, y: 0.0009, z: 0.1612}],
    [409.0, {x: 0.0384, y: 0.0011, z: 0.1830}],
    [410.0, {x: 0.0435, y: 0.0012, z: 0.2074}],
    [411.0, {x: 0.0489, y: 0.0014, z: 0.2334}],
    [412.0, {x: 0.0550, y: 0.0015, z: 0.2625}],
    [413.0, {x: 0.0618, y: 0.0017, z: 0.2949}],
    [414.0, {x: 0.0693, y: 0.0019, z: 0.3311}],
    [415.0, {x: 0.0776, y: 0.0022, z: 0.3713}],
    [416.0, {x: 0.0871, y: 0.0025, z: 0.4170}],
    [417.0, {x: 0.0976, y: 0.0028, z: 0.4673}],
    [418.0, {x: 0.1089, y: 0.0031, z: 0.5221}],
    [419.0, {x: 0.1212, y: 0.0035, z: 0.5815}],
    [420.0, {x: 0.1344, y: 0.0040, z: 0.6456}],
    [421.0, {x: 0.1497, y: 0.0046, z: 0.7201}],
    [422.0, {x: 0.1657, y: 0.0052, z: 0.7980}],
    [423.0, {x: 0.1820, y: 0.0058, z: 0.8780}],
    [424.0, {x: 0.1985, y: 0.0065, z: 0.9588}],
    [425.0, {x: 0.2148, y: 0.0073, z: 1.0391}],
    [426.0, {x: 0.2299, y: 0.0081, z: 1.1141}],
    [427.0, {x: 0.2445, y: 0.0089, z: 1.1868}],
    [428.0, {x: 0.2584, y: 0.0098, z: 1.2566}],
    [429.0, {x: 0.2716, y: 0.0107, z: 1.3230}],
    [430.0, {x: 0.2839, y: 0.0116, z: 1.3856}],
    [431.0, {x: 0.2948, y: 0.0126, z: 1.4419}],
    [432.0, {x: 0.3047, y: 0.0136, z: 1.4939}],
    [433.0, {x: 0.3136, y: 0.0146, z: 1.5414}],
    [434.0, {x: 0.3216, y: 0.0157, z: 1.5844}],
    [435.0, {x: 0.3285, y: 0.0168, z: 1.6230}],
    [436.0, {x: 0.3343, y: 0.0180, z: 1.6561}],
    [437.0, {x: 0.3391, y: 0.0192, z: 1.6848}],
    [438.0, {x: 0.3430, y: 0.0204, z: 1.7094}],
    [439.0, {x: 0.3461, y: 0.0217, z: 1.7301}],
    [440.0, {x: 0.3483, y: 0.0230, z: 1.7471}],
    [441.0, {x: 0.3496, y: 0.0243, z: 1.7599}],
    [442.0, {x: 0.3501, y: 0.0256, z: 1.7695}],
    [443.0, {x: 0.3500, y: 0.0270, z: 1.7763}],
    [444.0, {x: 0.3493, y: 0.0284, z: 1.7805}],
    [445.0, {x: 0.3481, y: 0.0298, z: 1.7826}],
    [446.0, {x: 0.3464, y: 0.0313, z: 1.7833}],
    [447.0, {x: 0.3444, y: 0.0329, z: 1.7823}],
    [448.0, {x: 0.3420, y: 0.0345, z: 1.7800}],
    [449.0, {x: 0.3392, y: 0.0362, z: 1.7765}],
    [450.0, {x: 0.3362, y: 0.0380, z: 1.7721}],
    [451.0, {x: 0.3333, y: 0.0398, z: 1.7688}],
    [452.0, {x: 0.3301, y: 0.0418, z: 1.7647}],
    [453.0, {x: 0.3267, y: 0.0438, z: 1.7593}],
    [454.0, {x: 0.3229, y: 0.0458, z: 1.7525}],
    [455.0, {x: 0.3187, y: 0.0480, z: 1.7441}],
    [456.0, {x: 0.3140, y: 0.0502, z: 1.7335}],
    [457.0, {x: 0.3089, y: 0.0526, z: 1.7208}],
    [458.0, {x: 0.3033, y: 0.0550, z: 1.7060}],
    [459.0, {x: 0.2973, y: 0.0574, z: 1.6889}],
    [460.0, {x: 0.2908, y: 0.0600, z: 1.6692}],
    [461.0, {x: 0.2839, y: 0.0626, z: 1.6473}],
    [462.0, {x: 0.2766, y: 0.0653, z: 1.6226}],
    [463.0, {x: 0.2687, y: 0.0680, z: 1.5946}],
    [464.0, {x: 0.2602, y: 0.0709, z: 1.5632}],
    [465.0, {x: 0.2511, y: 0.0739, z: 1.5281}],
    [466.0, {x: 0.2406, y: 0.0770, z: 1.4849}],
    [467.0, {x: 0.2297, y: 0.0803, z: 1.4386}],
    [468.0, {x: 0.2184, y: 0.0837, z: 1.3897}],
    [469.0, {x: 0.2069, y: 0.0872, z: 1.3392}],
    [470.0, {x: 0.1954, y: 0.0910, z: 1.2876}],
    [471.0, {x: 0.1844, y: 0.0949, z: 1.2382}],
    [472.0, {x: 0.1735, y: 0.0991, z: 1.1887}],
    [473.0, {x: 0.1628, y: 0.1034, z: 1.1394}],
    [474.0, {x: 0.1523, y: 0.1079, z: 1.0904}],
    [475.0, {x: 0.1421, y: 0.1126, z: 1.0419}],
    [476.0, {x: 0.1322, y: 0.1175, z: 0.9943}],
    [477.0, {x: 0.1226, y: 0.1226, z: 0.9474}],
    [478.0, {x: 0.1133, y: 0.1279, z: 0.9015}],
    [479.0, {x: 0.1043, y: 0.1334, z: 0.8567}],
    [480.0, {x: 0.0956, y: 0.1390, z: 0.8130}],
    [481.0, {x: 0.0873, y: 0.1446, z: 0.7706}],
    [482.0, {x: 0.0793, y: 0.1504, z: 0.7296}],
    [483.0, {x: 0.0718, y: 0.1564, z: 0.6902}],
    [484.0, {x: 0.0646, y: 0.1627, z: 0.6523}],
    [485.0, {x: 0.0580, y: 0.1693, z: 0.6162}],
    [486.0, {x: 0.0519, y: 0.1763, z: 0.5825}],
    [487.0, {x: 0.0463, y: 0.1836, z: 0.5507}],
    [488.0, {x: 0.0412, y: 0.1913, z: 0.5205}],
    [489.0, {x: 0.0364, y: 0.1994, z: 0.4920}],
    [490.0, {x: 0.0320, y: 0.2080, z: 0.4652}],
    [491.0, {x: 0.0279, y: 0.2171, z: 0.4399}],
    [492.0, {x: 0.0241, y: 0.2267, z: 0.4162}],
    [493.0, {x: 0.0207, y: 0.2368, z: 0.3939}],
    [494.0, {x: 0.0175, y: 0.2474, z: 0.3730}],
    [495.0, {x: 0.0147, y: 0.2586, z: 0.3533}],
    [496.0, {x: 0.0121, y: 0.2702, z: 0.3349}],
    [497.0, {x: 0.0099, y: 0.2824, z: 0.3176}],
    [498.0, {x: 0.0079, y: 0.2952, z: 0.3014}],
    [499.0, {x: 0.0063, y: 0.3087, z: 0.2862}],
    [500.0, {x: 0.0049, y: 0.3230, z: 0.2720}],
    [501.0, {x: 0.0037, y: 0.3385, z: 0.2588}],
    [502.0, {x: 0.0029, y: 0.3548, z: 0.2464}],
    [503.0, {x: 0.0024, y: 0.3717, z: 0.2346}],
    [504.0, {x: 0.0022, y: 0.3893, z: 0.2233}],
    [505.0, {x: 0.0024, y: 0.4073, z: 0.2123}],
    [506.0, {x: 0.0029, y: 0.4256, z: 0.2010}],
    [507.0, {x: 0.0038, y: 0.4443, z: 0.1899}],
    [508.0, {x: 0.0052, y: 0.4635, z: 0.1790}],
    [509.0, {x: 0.0070, y: 0.4830, z: 0.1685}],
    [510.0, {x: 0.0093, y: 0.5030, z: 0.1582}],
    [511.0, {x: 0.0122, y: 0.5237, z: 0.1481}],
    [512.0, {x: 0.0156, y: 0.5447, z: 0.1384}],
    [513.0, {x: 0.0195, y: 0.5658, z: 0.1290}],
    [514.0, {x: 0.0240, y: 0.5870, z: 0.1201}],
    [515.0, {x: 0.0291, y: 0.6082, z: 0.1117}],
    [516.0, {x: 0.0349, y: 0.6293, z: 0.1040}],
    [517.0, {x: 0.0412, y: 0.6502, z: 0.0968}],
    [518.0, {x: 0.0480, y: 0.6707, z: 0.0901}],
    [519.0, {x: 0.0554, y: 0.6906, z: 0.0839}],
    [520.0, {x: 0.0633, y: 0.7100, z: 0.0782}],
    [521.0, {x: 0.0716, y: 0.7280, z: 0.0733}],
    [522.0, {x: 0.0805, y: 0.7453, z: 0.0687}],
    [523.0, {x: 0.0898, y: 0.7619, z: 0.0646}],
    [524.0, {x: 0.0995, y: 0.7778, z: 0.0608}],
    [525.0, {x: 0.1096, y: 0.7932, z: 0.0573}],
    [526.0, {x: 0.1202, y: 0.8082, z: 0.0539}],
    [527.0, {x: 0.1311, y: 0.8225, z: 0.0507}],
    [528.0, {x: 0.1423, y: 0.8363, z: 0.0477}],
    [529.0, {x: 0.1538, y: 0.8495, z: 0.0449}],
    [530.0, {x: 0.1655, y: 0.8620, z: 0.0422}],
    [531.0, {x: 0.1772, y: 0.8738, z: 0.0395}],
    [532.0, {x: 0.1891, y: 0.8849, z: 0.0369}],
    [533.0, {x: 0.2011, y: 0.8955, z: 0.0344}],
    [534.0, {x: 0.2133, y: 0.9054, z: 0.0321}],
    [535.0, {x: 0.2257, y: 0.9149, z: 0.0298}],
    [536.0, {x: 0.2383, y: 0.9237, z: 0.0277}],
    [537.0, {x: 0.2511, y: 0.9321, z: 0.0257}],
    [538.0, {x: 0.2640, y: 0.9399, z: 0.0238}],
    [539.0, {x: 0.2771, y: 0.9472, z: 0.0220}],
    [540.0, {x: 0.2904, y: 0.9540, z: 0.0203}],
    [541.0, {x: 0.3039, y: 0.9602, z: 0.0187}],
    [542.0, {x: 0.3176, y: 0.9660, z: 0.0172}],
    [543.0, {x: 0.3314, y: 0.9712, z: 0.0159}],
    [544.0, {x: 0.3455, y: 0.9760, z: 0.0146}],
    [545.0, {x: 0.3597, y: 0.9803, z: 0.0134}],
    [546.0, {x: 0.3741, y: 0.9841, z: 0.0123}],
    [547.0, {x: 0.3886, y: 0.9874, z: 0.0113}],
    [548.0, {x: 0.4034, y: 0.9904, z: 0.0104}],
    [549.0, {x: 0.4183, y: 0.9929, z: 0.0095}],
    [550.0, {x: 0.4334, y: 0.9950, z: 0.0087}],
    [551.0, {x: 0.4488, y: 0.9967, z: 0.0080}],
    [552.0, {x: 0.4644, y: 0.9981, z: 0.0074}],
    [553.0, {x: 0.4801, y: 0.9992, z: 0.0068}],
    [554.0, {x: 0.4960, y: 0.9998, z: 0.0062}],
    [555.0, {x: 0.5121, y: 1.0000, z: 0.0057}],
    [556.0, {x: 0.5283, y: 0.9998, z: 0.0053}],
    [557.0, {x: 0.5447, y: 0.9993, z: 0.0049}],
    [558.0, {x: 0.5612, y: 0.9983, z: 0.0045}],
    [559.0, {x: 0.5778, y: 0.9969, z: 0.0042}],
    [560.0, {x: 0.5945, y: 0.9950, z: 0.0039}],
    [561.0, {x: 0.6112, y: 0.9926, z: 0.0036}],
    [562.0, {x: 0.6280, y: 0.9897, z: 0.0034}],
    [563.0, {x: 0.6448, y: 0.9865, z: 0.0031}],
    [564.0, {x: 0.6616, y: 0.9827, z: 0.0029}],
    [565.0, {x: 0.6784, y: 0.9786, z: 0.0027}],
    [566.0, {x: 0.6953, y: 0.9741, z: 0.0026}],
    [567.0, {x: 0.7121, y: 0.9692, z: 0.0024}],
    [568.0, {x: 0.7288, y: 0.9639, z: 0.0023}],
    [569.0, {x: 0.7455, y: 0.9581, z: 0.0022}],
    [570.0, {x: 0.7621, y: 0.9520, z: 0.0021}],
    [571.0, {x: 0.7785, y: 0.9454, z: 0.0020}],
    [572.0, {x: 0.7948, y: 0.9385, z: 0.0019}],
    [573.0, {x: 0.8109, y: 0.9312, z: 0.0019}],
    [574.0, {x: 0.8268, y: 0.9235, z: 0.0018}],
    [575.0, {x: 0.8425, y: 0.9154, z: 0.0018}],
    [576.0, {x: 0.8579, y: 0.9070, z: 0.0018}],
    [577.0, {x: 0.8731, y: 0.8983, z: 0.0017}],
    [578.0, {x: 0.8879, y: 0.8892, z: 0.0017}],
    [579.0, {x: 0.9023, y: 0.8798, z: 0.0017}],
    [580.0, {x: 0.9163, y: 0.8700, z: 0.0017}],
    [581.0, {x: 0.9298, y: 0.8598, z: 0.0016}],
    [582.0, {x: 0.9428, y: 0.8494, z: 0.0016}],
    [583.0, {x: 0.9553, y: 0.8386, z: 0.0015}],
    [584.0, {x: 0.9672, y: 0.8276, z: 0.0015}],
    [585.0, {x: 0.9786, y: 0.8163, z: 0.0014}],
    [586.0, {x: 0.9894, y: 0.8048, z: 0.0013}],
    [587.0, {x: 0.9996, y: 0.7931, z: 0.0013}],
    [588.0, {x: 1.0091, y: 0.7812, z: 0.0012}],
    [589.0, {x: 1.0181, y: 0.7692, z: 0.0012}],
    [590.0, {x: 1.0263, y: 0.7570, z: 0.0011}],
    [591.0, {x: 1.0340, y: 0.7448, z: 0.0011}],
    [592.0, {x: 1.0410, y: 0.7324, z: 0.0011}],
    [593.0, {x: 1.0471, y: 0.7200, z: 0.0010}],
    [594.0, {x: 1.0524, y: 0.7075, z: 0.0010}],
    [595.0, {x: 1.0567, y: 0.6949, z: 0.0010}],
    [596.0, {x: 1.0597, y: 0.6822, z: 0.0010}],
    [597.0, {x: 1.0617, y: 0.6695, z: 0.0009}],
    [598.0, {x: 1.0628, y: 0.6567, z: 0.0009}],
    [599.0, {x: 1.0630, y: 0.6439, z: 0.0008}],
    [600.0, {x: 1.0622, y: 0.6310, z: 0.0008}],
    [601.0, {x: 1.0608, y: 0.6182, z: 0.0008}],
    [602.0, {x: 1.0585, y: 0.6053, z: 0.0007}],
    [603.0, {x: 1.0552, y: 0.5925, z: 0.0007}],
    [604.0, {x: 1.0509, y: 0.5796, z: 0.0006}],
    [605.0, {x: 1.0456, y: 0.5668, z: 0.0006}],
    [606.0, {x: 1.0389, y: 0.5540, z: 0.0005}],
    [607.0, {x: 1.0313, y: 0.5411, z: 0.0005}],
    [608.0, {x: 1.0226, y: 0.5284, z: 0.0004}],
    [609.0, {x: 1.0131, y: 0.5157, z: 0.0004}],
    [610.0, {x: 1.0026, y: 0.5030, z: 0.0003}],
    [611.0, {x: 0.9914, y: 0.4905, z: 0.0003}],
    [612.0, {x: 0.9794, y: 0.4781, z: 0.0003}],
    [613.0, {x: 0.9665, y: 0.4657, z: 0.0003}],
    [614.0, {x: 0.9529, y: 0.4534, z: 0.0003}],
    [615.0, {x: 0.9384, y: 0.4412, z: 0.0002}],
    [616.0, {x: 0.9232, y: 0.4291, z: 0.0002}],
    [617.0, {x: 0.9072, y: 0.4170, z: 0.0002}],
    [618.0, {x: 0.8904, y: 0.4050, z: 0.0002}],
    [619.0, {x: 0.8728, y: 0.3930, z: 0.0002}],
    [620.0, {x: 0.8544, y: 0.3810, z: 0.0002}],
    [621.0, {x: 0.8349, y: 0.3689, z: 0.0002}],
    [622.0, {x: 0.8148, y: 0.3568, z: 0.0002}],
    [623.0, {x: 0.7941, y: 0.3447, z: 0.0001}],
    [624.0, {x: 0.7729, y: 0.3328, z: 0.0001}],
    [625.0, {x: 0.7514, y: 0.3210, z: 0.0001}],
    [626.0, {x: 0.7296, y: 0.3094, z: 0.0001}],
    [627.0, {x: 0.7077, y: 0.2979, z: 0.0001}],
    [628.0, {x: 0.6858, y: 0.2867, z: 0.0001}],
    [629.0, {x: 0.6640, y: 0.2757, z: 0.0001}],
    [630.0, {x: 0.6424, y: 0.2650, z: 0.0000}],
    [631.0, {x: 0.6217, y: 0.2548, z: 0.0000}],
    [632.0, {x: 0.6013, y: 0.2450, z: 0.0000}],
    [633.0, {x: 0.5812, y: 0.2354, z: 0.0000}],
    [634.0, {x: 0.5614, y: 0.2261, z: 0.0000}],
    [635.0, {x: 0.5419, y: 0.2170, z: 0.0000}],
    [636.0, {x: 0.5226, y: 0.2081, z: 0.0000}],
    [637.0, {x: 0.5035, y: 0.1995, z: 0.0000}],
    [638.0, {x: 0.4847, y: 0.1911, z: 0.0000}],
    [639.0, {x: 0.4662, y: 0.1830, z: 0.0000}],
    [640.0, {x: 0.4479, y: 0.1750, z: 0.0000}],
    [641.0, {x: 0.4298, y: 0.1672, z: 0.0000}],
    [642.0, {x: 0.4121, y: 0.1596, z: 0.0000}],
    [643.0, {x: 0.3946, y: 0.1523, z: 0.0000}],
    [644.0, {x: 0.3775, y: 0.1451, z: 0.0000}],
    [645.0, {x: 0.3608, y: 0.1382, z: 0.0000}],
    [646.0, {x: 0.3445, y: 0.1315, z: 0.0000}],
    [647.0, {x: 0.3286, y: 0.1250, z: 0.0000}],
    [648.0, {x: 0.3131, y: 0.1188, z: 0.0000}],
    [649.0, {x: 0.2980, y: 0.1128, z: 0.0000}],
    [650.0, {x: 0.2835, y: 0.1070, z: 0.0000}],
    [651.0, {x: 0.2696, y: 0.1015, z: 0.0000}],
    [652.0, {x: 0.2562, y: 0.0962, z: 0.0000}],
    [653.0, {x: 0.2432, y: 0.0911, z: 0.0000}],
    [654.0, {x: 0.2307, y: 0.0863, z: 0.0000}],
    [655.0, {x: 0.2187, y: 0.0816, z: 0.0000}],
    [656.0, {x: 0.2071, y: 0.0771, z: 0.0000}],
    [657.0, {x: 0.1959, y: 0.0728, z: 0.0000}],
    [658.0, {x: 0.1852, y: 0.0687, z: 0.0000}],
    [659.0, {x: 0.1748, y: 0.0648, z: 0.0000}],
    [660.0, {x: 0.1649, y: 0.0610, z: 0.0000}],
    [661.0, {x: 0.1554, y: 0.0574, z: 0.0000}],
    [662.0, {x: 0.1462, y: 0.0539, z: 0.0000}],
    [663.0, {x: 0.1375, y: 0.0507, z: 0.0000}],
    [664.0, {x: 0.1291, y: 0.0475, z: 0.0000}],
    [665.0, {x: 0.1212, y: 0.0446, z: 0.0000}],
    [666.0, {x: 0.1136, y: 0.0418, z: 0.0000}],
    [667.0, {x: 0.1065, y: 0.0391, z: 0.0000}],
    [668.0, {x: 0.0997, y: 0.0366, z: 0.0000}],
    [669.0, {x: 0.0934, y: 0.0342, z: 0.0000}],
    [670.0, {x: 0.0874, y: 0.0320, z: 0.0000}],
    [671.0, {x: 0.0819, y: 0.0300, z: 0.0000}],
    [672.0, {x: 0.0768, y: 0.0281, z: 0.0000}],
    [673.0, {x: 0.0721, y: 0.0263, z: 0.0000}],
    [674.0, {x: 0.0677, y: 0.0247, z: 0.0000}],
    [675.0, {x: 0.0636, y: 0.0232, z: 0.0000}],
    [676.0, {x: 0.0598, y: 0.0218, z: 0.0000}],
    [677.0, {x: 0.0563, y: 0.0205, z: 0.0000}],
    [678.0, {x: 0.0529, y: 0.0193, z: 0.0000}],
    [679.0, {x: 0.0498, y: 0.0181, z: 0.0000}],
    [680.0, {x: 0.0468, y: 0.0170, z: 0.0000}],
    [681.0, {x: 0.0437, y: 0.0159, z: 0.0000}],
    [682.0, {x: 0.0408, y: 0.0148, z: 0.0000}],
    [683.0, {x: 0.0380, y: 0.0138, z: 0.0000}],
    [684.0, {x: 0.0354, y: 0.0128, z: 0.0000}],
    [685.0, {x: 0.0329, y: 0.0119, z: 0.0000}],
    [686.0, {x: 0.0306, y: 0.0111, z: 0.0000}],
    [687.0, {x: 0.0284, y: 0.0103, z: 0.0000}],
    [688.0, {x: 0.0264, y: 0.0095, z: 0.0000}],
    [689.0, {x: 0.0245, y: 0.0088, z: 0.0000}],
    [690.0, {x: 0.0227, y: 0.0082, z: 0.0000}],
    [691.0, {x: 0.0211, y: 0.0076, z: 0.0000}],
    [692.0, {x: 0.0196, y: 0.0071, z: 0.0000}],
    [693.0, {x: 0.0182, y: 0.0066, z: 0.0000}],
    [694.0, {x: 0.0170, y: 0.0061, z: 0.0000}],
    [695.0, {x: 0.0158, y: 0.0057, z: 0.0000}],
    [696.0, {x: 0.0148, y: 0.0053, z: 0.0000}],
    [697.0, {x: 0.0138, y: 0.0050, z: 0.0000}],
    [698.0, {x: 0.0129, y: 0.0047, z: 0.0000}],
    [699.0, {x: 0.0121, y: 0.0044, z: 0.0000}],
    [700.0, {x: 0.0114, y: 0.0041, z: 0.0000}],
    [701.0, {x: 0.0106, y: 0.0038, z: 0.0000}],
    [702.0, {x: 0.0099, y: 0.0036, z: 0.0000}],
    [703.0, {x: 0.0093, y: 0.0034, z: 0.0000}],
    [704.0, {x: 0.0087, y: 0.0031, z: 0.0000}],
    [705.0, {x: 0.0081, y: 0.0029, z: 0.0000}],
    [706.0, {x: 0.0076, y: 0.0027, z: 0.0000}],
    [707.0, {x: 0.0071, y: 0.0026, z: 0.0000}],
    [708.0, {x: 0.0066, y: 0.0024, z: 0.0000}],
    [709.0, {x: 0.0062, y: 0.0022, z: 0.0000}],
    [710.0, {x: 0.0058, y: 0.0021, z: 0.0000}],
    [711.0, {x: 0.0054, y: 0.0020, z: 0.0000}],
    [712.0, {x: 0.0051, y: 0.0018, z: 0.0000}],
    [713.0, {x: 0.0047, y: 0.0017, z: 0.0000}],
    [714.0, {x: 0.0044, y: 0.0016, z: 0.0000}],
    [715.0, {x: 0.0041, y: 0.0015, z: 0.0000}],
    [716.0, {x: 0.0038, y: 0.0014, z: 0.0000}],
    [717.0, {x: 0.0036, y: 0.0013, z: 0.0000}],
    [718.0, {x: 0.0033, y: 0.0012, z: 0.0000}],
    [719.0, {x: 0.0031, y: 0.0011, z: 0.0000}],
    [720.0, {x: 0.0029, y: 0.0010, z: 0.0000}],
    [721.0, {x: 0.0027, y: 0.0010, z: 0.0000}],
    [722.0, {x: 0.0025, y: 0.0009, z: 0.0000}],
    [723.0, {x: 0.0024, y: 0.0008, z: 0.0000}],
    [724.0, {x: 0.0022, y: 0.0008, z: 0.0000}],
    [725.0, {x: 0.0020, y: 0.0007, z: 0.0000}],
    [726.0, {x: 0.0019, y: 0.0007, z: 0.0000}],
    [727.0, {x: 0.0018, y: 0.0006, z: 0.0000}],
    [728.0, {x: 0.0017, y: 0.0006, z: 0.0000}],
    [729.0, {x: 0.0015, y: 0.0006, z: 0.0000}],
    [730.0, {x: 0.0014, y: 0.0005, z: 0.0000}],
    [731.0, {x: 0.0013, y: 0.0005, z: 0.0000}],
    [732.0, {x: 0.0012, y: 0.0004, z: 0.0000}],
    [733.0, {x: 0.0012, y: 0.0004, z: 0.0000}],
    [734.0, {x: 0.0011, y: 0.0004, z: 0.0000}],
    [735.0, {x: 0.0010, y: 0.0004, z: 0.0000}],
    [736.0, {x: 0.0009, y: 0.0003, z: 0.0000}],
    [737.0, {x: 0.0009, y: 0.0003, z: 0.0000}],
    [738.0, {x: 0.0008, y: 0.0003, z: 0.0000}],
    [739.0, {x: 0.0007, y: 0.0003, z: 0.0000}],
    [740.0, {x: 0.0007, y: 0.0002, z: 0.0000}],
    [741.0, {x: 0.0006, y: 0.0002, z: 0.0000}],
    [742.0, {x: 0.0006, y: 0.0002, z: 0.0000}],
    [743.0, {x: 0.0006, y: 0.0002, z: 0.0000}],
    [744.0, {x: 0.0005, y: 0.0002, z: 0.0000}],
    [745.0, {x: 0.0005, y: 0.0002, z: 0.0000}],
    [746.0, {x: 0.0004, y: 0.0002, z: 0.0000}],
    [747.0, {x: 0.0004, y: 0.0001, z: 0.0000}],
    [748.0, {x: 0.0004, y: 0.0001, z: 0.0000}],
    [749.0, {x: 0.0004, y: 0.0001, z: 0.0000}],
    [750.0, {x: 0.0003, y: 0.0001, z: 0.0000}],
    [751.0, {x: 0.0003, y: 0.0001, z: 0.0000}],
    [752.0, {x: 0.0003, y: 0.0001, z: 0.0000}],
    [753.0, {x: 0.0003, y: 0.0001, z: 0.0000}],
    [754.0, {x: 0.0003, y: 0.0001, z: 0.0000}],
    [755.0, {x: 0.0002, y: 0.0001, z: 0.0000}],
    [756.0, {x: 0.0002, y: 0.0001, z: 0.0000}],
    [757.0, {x: 0.0002, y: 0.0001, z: 0.0000}],
    [758.0, {x: 0.0002, y: 0.0001, z: 0.0000}],
    [759.0, {x: 0.0002, y: 0.0001, z: 0.0000}],
    [760.0, {x: 0.0002, y: 0.0001, z: 0.0000}],
    [761.0, {x: 0.0002, y: 0.0001, z: 0.0000}],
    [762.0, {x: 0.0001, y: 0.0001, z: 0.0000}],
    [763.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [764.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [765.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [766.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [767.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [768.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [769.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [770.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [771.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [772.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [773.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [774.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [775.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [776.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [777.0, {x: 0.0001, y: 0.0000, z: 0.0000}],
    [778.0, {x: 0.0000, y: 0.0000, z: 0.0000}],
    [779.0, {x: 0.0000, y: 0.0000, z: 0.0000}],
    [780.0, {x: 0.0000, y: 0.0000, z: 0.0000}],
  ];
}