export default class ShapePrimitive {
    constructor(shape, material) {
        this.shape = shape;
    }
    intersect(ray) {
        const distance = this.shape.intersect(ray);
        if (distance === null) {
            return null;
        }
        return {}; // TODO return SurfaceInteraction
    }
}
