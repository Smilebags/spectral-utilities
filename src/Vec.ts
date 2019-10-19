export class Vec2 {
  constructor(
    public x: number,
    public y: number,
  ) {}

  add(other: Vec2): Vec2 {
    return new Vec2(
      this.x + other.x,
      this.y + other.y,
    );
  }
}

export class Vec3 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  add(other: Vec3): Vec3 {
    return new Vec3(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z,
    );
  }
}