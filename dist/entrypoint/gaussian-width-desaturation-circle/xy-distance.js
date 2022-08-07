import Colour from "../../Colour/Colour.js";
import { mapValue } from "../../Util.js";
const LOW = 390;
const HIGH = 830;
const SAMPLES = HIGH - LOW + 1;
const coords = new Array(SAMPLES).fill(null).map((item, index, arr) => {
    const progress = mapValue(index, 0, arr.length - 1, 0, 1);
    const wavelength = mapValue(progress, 0, 1, LOW, HIGH);
    return {
        colour: Colour.fromWavelength(wavelength),
        wavelength,
    };
});
const distances = [];
for (let i = 1; i < coords.length; i++) {
    const coord = coords[i];
    const relative = coord.colour.triplet.subtract(coords[i - 1].colour.triplet);
    const distance = Math.sqrt((relative.x ** 2) + (relative.y ** 2) + (relative.z ** 2));
    distances.push([
        distance,
        coord.wavelength,
    ]);
}
// console.log(distances);
let cumulativeDistance = 0;
const progressiveDistances = distances.map(dist => {
    cumulativeDistance += dist[0];
    return [
        cumulativeDistance,
        dist[1],
    ];
});
export const adjustedCumulative = progressiveDistances.map(dist => [dist[0] / cumulativeDistance, dist[1]]);
console.log(adjustedCumulative);
console.log(cumulativeDistance);
// console.log(distances.map(d => d[0]).map(d => 1/d));
console.log(findFirstIndex(adjustedCumulative, (item) => item[0] >= 0.5));
export function findFirstIndex(arr, comparisonFunction) {
    let i = 0;
    while (!comparisonFunction(arr[i])) {
        i++;
    }
    return i;
}
function arraySum(arr) {
    return arr.reduce((total, current) => total + current, 0);
}
