import { ColourSpace, ColourSpaceName } from "./ColourSpace.js";

export class ColourSpaceProvider {
  constructor(
    private spaces: ColourSpace[],
  ) {}

  get(name: ColourSpaceName): ColourSpace {
    const space = this.spaces.find(space => space.name === name);
    if (!space) {
      throw 'Unknown colour space';
    }
    return space;
  }
}
