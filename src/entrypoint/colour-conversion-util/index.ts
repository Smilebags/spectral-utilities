import Colour from "../../Colour/Colour.js";
import { Vec3 } from "../../Vec.js";

const main = async () => {
  const data = [
    { name: 'Saturated-YELLOW', colour: new Colour(new Vec3(43.998, 49.025, 15.356), 'XYZ') },
    { name: 'DeSaturated-YELLOW', colour: new Colour(new Vec3(15.014, 16.608, 7.813), 'XYZ') },
    { name: 'Saturated-RED', colour: new Colour(new Vec3(26.259, 18.778, 12.264), 'XYZ') },
    { name: 'DeSaturated-RED', colour: new Colour(new Vec3(9.223, 7.268, 5.4), 'XYZ') },
    { name: 'Saturated-MAGENTA', colour: new Colour(new Vec3(31.731, 23.483, 48.031), 'XYZ') },
    { name: 'Desaturated-MAGENTA', colour: new Colour(new Vec3(9.942, 7.719, 14.33), 'XYZ') },
    { name: 'Saturated-BLUE', colour: new Colour(new Vec3(15.329, 14.058, 43.056), 'XYZ') },
    { name: 'DeSaturated-BLUE', colour: new Colour(new Vec3(6.687, 6.221, 17.007), 'XYZ') },
    { name: 'Saturated-CYAN', colour: new Colour(new Vec3(33.753, 45.24, 56.417), 'XYZ') },
    { name: 'Desaturated-CYAN', colour: new Colour(new Vec3(11.001, 14.281, 17.502), 'XYZ') },
    { name: 'Saturated-GREEN', colour: new Colour(new Vec3(25.003, 36.581, 15.569), 'XYZ') },
    { name: 'Desaturated-GREEN', colour: new Colour(new Vec3(8.345, 11.694, 6.142), 'XYZ') },
    { name: '2R15', colour: new Colour(new Vec3(6.12, 5.888, 4.564), 'XYZ') },
    { name: '1Y07', colour: new Colour(new Vec3(31.519, 30.427, 22.062), 'XYZ') },
    { name: '1R12', colour: new Colour(new Vec3(14.966, 13.647, 8.077), 'XYZ') },
    { name: '1Y09', colour: new Colour(new Vec3(25.045, 23.503, 14.995), 'XYZ') },
    { name: '2Y04', colour: new Colour(new Vec3(38.466, 37.957, 29.557), 'XYZ') },
    { name: '2Y01', colour: new Colour(new Vec3(43.088, 42.587, 35.068), 'XYZ') },
    { name: 'N 9.25/Gray 1', colour: new Colour(new Vec3(79.247, 83.884, 89.414), 'XYZ') },
    { name: 'N 9.0/Gray 2', colour: new Colour(new Vec3(71.558, 75.67, 81.082), 'XYZ') },
    { name: 'N 8.5/Gray 3', colour: new Colour(new Vec3(61.098, 64.537, 69.796), 'XYZ') },
    { name: 'N 7.0/Gray 4', colour: new Colour(new Vec3(38.372, 40.473, 43.922), 'XYZ') },
    { name: 'N 5.5/Gray 5', colour: new Colour(new Vec3(22.273, 23.543, 25.203), 'XYZ') },
    { name: 'N 3.0/Gray 7', colour: new Colour(new Vec3(5.973, 6.309, 6.95), 'XYZ') },
    { name: 'N 2.5/Gray 8', colour: new Colour(new Vec3(4.206, 4.417, 4.723), 'XYZ') },
    { name: 'N 2.25/Gray 9', colour: new Colour(new Vec3(3.461, 3.647, 4.007), 'XYZ') },
    { name: 'N 2.0/Gray 10', colour: new Colour(new Vec3(2.802, 2.97, 3.261), 'XYZ') },
    { name: 'WHITE', colour: new Colour(new Vec3(84.634, 89.596, 92.808), 'XYZ') },
    { name: 'BLACK', colour: new Colour(new Vec3(0.587, 0.606, 0.676), 'XYZ') },
  ];

  for(const entry of data) {
    entry.colour = entry.colour.multiply(1/100).to('sRGB');
  }

  console.log(data.map(d => `${d.name.padEnd(20)}: ${d.colour.hex}`));

};

main();