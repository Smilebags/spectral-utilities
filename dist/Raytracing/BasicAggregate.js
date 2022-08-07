export default class BasicAggregate {
    constructor(primitives) {
        this.primitives = primitives;
    }
    intersect(ray) {
        let surfaceInteraction = null;
        for (let i = 0; i < this.primitives.length; i++) {
            const primitive = this.primitives[i];
            const interaction = primitive.intersect(ray);
            if (interaction === null) {
                continue;
            }
            surfaceInteraction = interaction;
        }
        return surfaceInteraction;
    }
}
