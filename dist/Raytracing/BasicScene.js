export default class BasicScene {
    constructor(aggregate) {
        this.aggregate = aggregate;
    }
    intersect(ray) {
        return this.aggregate.intersect(ray);
    }
}
