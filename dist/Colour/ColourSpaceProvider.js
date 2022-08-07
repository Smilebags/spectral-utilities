export class ColourSpaceProvider {
    constructor(spaces) {
        this.spaces = spaces;
    }
    get(name) {
        const space = this.spaces.find(space => space.name === name);
        if (!space) {
            throw 'Unknown colour space';
        }
        return space;
    }
}
