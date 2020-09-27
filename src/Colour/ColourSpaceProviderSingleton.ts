import GenericColourSpace, { Matrix } from "./ColourSpace.js";
import { ColourSpaceProvider } from "./ColourSpaceProvider.js";
import { ColourSpace } from "../types/index.js";
import { clamp } from "../Util.js";
import { Vec3 } from "../Vec.js";

function toSrgbEotf(colour: Vec3) {
  return new Vec3(
    colour.x < 0 ? -1 : colour.x ** (1 / 2.2),
    colour.y < 0 ? -1 : colour.y ** (1 / 2.2),
    colour.z < 0 ? -1 : colour.z ** (1 / 2.2),
  );
}
function fromSrgbEotf(colour: Vec3) {
  return new Vec3(
    colour.x ** 2.2,
    colour.y ** 2.2,
    colour.z ** 2.2,
  );
}

const toD65: Matrix = [
  [0.9531874, -0.0265906, 0.0238731],
  [-0.0382467, 1.0288406, 0.0094060],
  [0.0026068, -0.0030332, 1.0892565],
];

const fromD65: Matrix = [
  [1.0502616, 0.0270757, -0.0232523],
  [0.0390650, 0.9729502, -0.0092579],
  [-0.0024047, 0.0026446, 0.9180873],
];


const rec709 = new GenericColourSpace(
  'REC.709',
  [
    [3.2404542, -1.5371385, -0.4985314],
    [-0.9692660, 1.8760108, 0.0415560],
    [0.0556434, -0.2040259, 1.0572252],
  ],
  [
    [0.4124564, 0.3575761, 0.1804375,],
    [0.2126729, 0.7151522, 0.0721750,],
    [0.0193339, 0.1191920, 0.9503041,],
  ],
  toD65,
  fromD65,
);

const rec2020 = new GenericColourSpace(
  'REC.2020',
  [
    [1.71666343, -0.35567332, -0.25336809],
    [-0.66667384, 1.61645574, 0.0157683],
    [0.01764248, -0.04277698, 0.94224328],
  ],
  [
    [6.36953507e-01, 1.44619185e-01, 1.68855854e-01],
    [2.62698339e-01, 6.78008766e-01, 5.92928953e-02],
    [4.99407097e-17, 2.80731358e-02, 1.06082723e+00],
  ],
  toD65,
  fromD65,
);

const dcip3 = new GenericColourSpace(
  'DCI-P3',
  [
    [2.72539403, -1.01800301, -0.4401632],
    [-0.79516803, 1.68973205, 0.02264719],
    [0.04124189, -0.08763902, 1.10092938],
  ],
  [
    [4.45169816e-01, 2.77134409e-01, 1.72282670e-01],
    [2.09491678e-01, 7.21595254e-01, 6.89130679e-02],
    [-3.63410132e-17, 4.70605601e-02, 9.07355394e-01],
  ],
  toD65,
  fromD65,
);

const displayP3: ColourSpace = {
  name: 'Display-P3',
  to(colour: Vec3) {
    return toSrgbEotf(dcip3.to(colour));
  },
  from(colour: Vec3) {
    return dcip3.from(fromSrgbEotf(colour));
  },
};

const sRGB: ColourSpace = {
  name: 'sRGB',
  to(colour: Vec3) {
    return toSrgbEotf(rec709.to(colour));
  },
  from(colour: Vec3) {
    return rec709.from(fromSrgbEotf(colour));
  },
};

const xyY: ColourSpace = {
  name: 'xyY',
  to(xyz: Vec3) {
    const x = xyz.x / (xyz.x + xyz.y + xyz.z);
    const y = xyz.y / (xyz.x + xyz.y + xyz.z);
    const Y = xyz.y;
    return new Vec3(x, y, Y);
  },
  from(triplet: Vec3) {
    const { x, y, z: Y } = triplet;
    const X = (x * Y) / y;
    const Z = ((1 - x - y) * Y) / y;
    return new Vec3(X, Y, Z);
  },
};

const XYZ = new GenericColourSpace(
  'XYZ',
  [
    [1,0,0],
    [0,1,0],
    [0,0,1],
  ],
  [
    [1,0,0],
    [0,1,0],
    [0,0,1],
  ],
);
const XYZD65 = new GenericColourSpace(
  'XYZD65',
  [
    [1,0,0],
    [0,1,0],
    [0,0,1],
  ],
  [
    [1,0,0],
    [0,1,0,],
    [0,0,1],
  ],
  toD65,
  fromD65,
);

const spaces: ColourSpace[] = [
  sRGB,
  rec709,
  xyY,
  rec2020,
  dcip3,
  displayP3,
  XYZ,
  XYZD65,
];
export default new ColourSpaceProvider(spaces);