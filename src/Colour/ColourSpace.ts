import { Vec3 } from "../Vec.js";

export type ColourSpaceName =
  'XYZ' |
  'xyY' |
  'LMS' |
  'lab' |
  'REC.2020' |
  'REC.709' |
  'sRGB' |
  'DCI-P3' |
  'Display-P3';

export interface ColourSpace {
  name: ColourSpaceName;
  to(colour: Vec3): Vec3;
  from(colour: Vec3): Vec3;
}

export type Matrix = [
  [number,number,number],
  [number,number,number],
  [number,number,number],
];
