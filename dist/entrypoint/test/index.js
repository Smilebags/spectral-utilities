import Colour from "../../Colour/Colour.js";
import { Vec3 } from "../../Vec.js";
import { test, expect } from './test.js';
test('test tolerance', () => {
    expect(10).toBeCloseTo(10);
    expect(() => expect(10).toBeCloseTo(11)).toThrow();
    expect(10).toBeCloseTo(10.0001, 4);
    expect(() => expect(10).toBeCloseTo(10.0001, 5)).toThrow();
    expect(10).toBeCloseTo(11, 0);
    expect(10).toBeCloseTo(100, -2);
});
test(`White XYZ to xyY`, () => {
    const base = new Colour(new Vec3(1, 1, 1), 'XYZ');
    const destination = base.to('xyY');
    expect(destination.triplet.x).toBeCloseTo(1 / 3);
    expect(destination.triplet.y).toBeCloseTo(1 / 3);
    expect(destination.triplet.z).toBeCloseTo(1);
});
// test(`White XYZ to XYZD65`, () => {
//   const base = new Colour(new Vec3(1, 1, 1), 'XYZ');
//   const destination = base.to('XYZD65');
//   expect(destination.triplet.x).toBeCloseTo(0.9504547, 6);
//   expect(destination.triplet.y).toBeCloseTo(1, 7);
//   expect(destination.triplet.z).toBeCloseTo(1.08905, 6);
// });
// test(`XYZD65 round trip`, () => {
//   const base = new Colour(new Vec3(1, 1, 1), 'XYZ');
//   const destination = base.to('XYZD65').to('XYZ');
//   expect(destination.triplet.x).toBeCloseTo(1);
//   expect(destination.triplet.y).toBeCloseTo(1);
//   expect(destination.triplet.z).toBeCloseTo(1);
// });
// test(`White XYZ to REC.709`, () => {
//   const base = new Colour(new Vec3(1, 1, 1), 'XYZ');
//   const adapted = base.to('XYZD65');
//   adapted.colourSpace = 'XYZ';
//   const destination = adapted.to('REC.709');
//   expect(destination.triplet.x).toBeCloseTo(1, 3);
//   expect(destination.triplet.y).toBeCloseTo(1, 3);
//   expect(destination.triplet.y).toBeCloseTo(1, 3);
// });
const rec709ToxyYTestCases = [
    ['White', new Vec3(1, 1, 1), new Vec3(0.313, 0.329, 1)],
    ['Red', new Vec3(1, 0, 0), new Vec3(0.640, 0.330, 0.2126)],
    ['Green', new Vec3(0, 1, 0), new Vec3(0.300, 0.600, 0.7152)],
    ['Blue', new Vec3(0, 0, 1), new Vec3(0.150, 0.060, 0.0722)],
];
rec709ToxyYTestCases.forEach(([colourName, sourceTriplet, expectedXY]) => {
    test(`${colourName} REC.709 to xyY`, () => {
        const base = new Colour(sourceTriplet, 'REC.709');
        const destination = base.to('xyY');
        expect(destination.triplet.x).toBeCloseTo(expectedXY.x, 3);
        expect(destination.triplet.y).toBeCloseTo(expectedXY.y, 3);
        expect(destination.triplet.z).toBeCloseTo(expectedXY.z, 3);
    });
});
const rec709TosRGBTestCases = [
    ['White', new Vec3(1, 1, 1), new Vec3(1, 1, 1)],
    ['Grey', new Vec3(0.5, 0.5, 0.5), new Vec3(0.72974, 0.72974, 0.72974)],
    ['Red', new Vec3(0.8, 0, 0), new Vec3(0.8 ** (1 / 2.2), 0, 0)],
    ['Green', new Vec3(0, 1, 0), new Vec3(0, 1, 0)],
    ['Blue', new Vec3(0, 0, 1), new Vec3(0, 0, 1)],
];
rec709TosRGBTestCases.forEach(([colourName, sourceTriplet, expectedTriplet]) => {
    test(`${colourName} REC.709 to sRGB`, () => {
        const base = new Colour(sourceTriplet, 'REC.709');
        const destination = base.to('sRGB');
        expect(destination.triplet.x).toBeCloseTo(expectedTriplet.x, 3);
        expect(destination.triplet.y).toBeCloseTo(expectedTriplet.y, 3);
        expect(destination.triplet.z).toBeCloseTo(expectedTriplet.z, 3);
    });
});
const colourSpaces = [
    'XYZ',
    'sRGB',
    'REC.709',
    'xyY',
    'REC.2020',
    'DCI-P3',
    'Display-P3',
];
colourSpaces.forEach((colourSpace) => {
    test(`Colour round-trip to ${colourSpace}`, () => {
        const base = new Colour(new Vec3(0.35, 0.3, 0.4), 'XYZ');
        const roundTrip = base.to(colourSpace).to('XYZ');
        expect(roundTrip.triplet.x).toBeCloseTo(0.35, 7);
        expect(roundTrip.triplet.y).toBeCloseTo(0.3, 7);
        expect(roundTrip.triplet.z).toBeCloseTo(0.4, 7);
    });
});
test(`Colour round-trip from REC.709 to sRGB`, () => {
    const base = new Colour(new Vec3(0.35, 0.3, 0.4), 'REC.709');
    const roundTrip = base.to('sRGB').to('REC.709');
    expect(roundTrip.triplet.x).toBeCloseTo(0.35, 6);
    expect(roundTrip.triplet.y).toBeCloseTo(0.3, 6);
    expect(roundTrip.triplet.z).toBeCloseTo(0.4, 6);
});
test(`Colour hex`, () => {
    const a = new Colour(new Vec3(0, 0.5, 1), 'sRGB');
    const b = new Colour(new Vec3(0.2, 0.5, 1), 'sRGB');
    const c = new Colour(new Vec3(1, 1, 1), 'sRGB');
    const d = a.multiply(0.5);
    expect(a.hex).toBe('#0080ff');
    expect(b.hex).toBe('#3380ff');
    expect(c.hex).toBe('#ffffff');
    expect(d.hex).toBe('#004080');
});
test(`Colour mixing in sRGB`, () => {
    const a = new Colour(new Vec3(0.2, 0.5, 1), 'sRGB');
    const b = new Colour(new Vec3(1, 1, 1), 'sRGB');
    const result = a.lerp(b, 0.5);
    expect(result.triplet.x).toBeCloseTo(0.6, 6);
    expect(result.triplet.y).toBeCloseTo(0.75, 6);
    expect(result.triplet.z).toBeCloseTo(1, 6);
});
