export class Vec2 {
  constructor(
    public x: number,
    public y: number,
  ) {}


  add(other: Vec2 | number): Vec2 {
    if(typeof other === "number") {
      return new Vec2(
        this.x + other,
        this.y + other,
      );
    }
    return new Vec2(
      this.x + other.x,
      this.y + other.y,
    );
  }

  subtract(v: Vec2 | number): Vec2 {
    if (typeof v === 'number') {
      return new Vec2(this.x - v, this.y - v);
    }
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  multiply(v: Vec2 | number): Vec2 {
      if(typeof v === "number") {
          return new Vec2(this.x * v, this.y * v);
      } else {
          return new Vec2(this.x * v.x, this.y * v.y);
      }
  }

  divide(v: Vec2): Vec2 {
      return new Vec2(
          v.x === 0 ? 0 : (this.x / v.x),
          v.y === 0 ? 0 : (this.y / v.y),
      );
  }

  normalise(): Vec2 {
      const mag = this.magnitude;
      return new Vec2(this.x / mag, this.y / mag);
  }

  get magnitude(): number {
      return Math.sqrt((this.x ** 2) + (this.y ** 2));
  }

  dot(v: Vec3): number {
      return this.x * v.x + this.y * v.y;
  }
}

export class Vec3 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}
  
  static fromArray(numbers: [number, number, number]): Vec3 {
    return new Vec3(...numbers);
  }

  add(other: Vec3): Vec3 {
    return new Vec3(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z,
    );
  }

  subtract(other: Vec3): Vec3 {
    return new Vec3(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z,
    );
  }

  multiply(other: Vec3 | number): Vec3 {
      if(typeof other === "number") {
          return new Vec3(this.x * other, this.y * other, this.z * other);
      } else {
          return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
      }
  }

  divide(other: Vec3): Vec3 {
      return new Vec3(
          other.x === 0 ? 0 : (this.x / other.x),
          other.y === 0 ? 0 : (this.y / other.y),
          other.z === 0 ? 0 : (this.z / other.z),
      );
  }

  normalise(): Vec3 {
      const mag = this.magnitude;
      return new Vec3(this.x / mag, this.y / mag, this.z / mag);
  }

  get magnitude(): number {
      return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2));
  }

  dot(v: Vec3): number {
      return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vec3): Vec3 {
      return new Vec3(
          (this.y * v.z) - (this.z * v.y),
          (this.z * v.x) - (this.x * v.z),
          (this.x * v.y) - (this.y * v.x),
      );
  }

  toArray(): [number, number, number] {
    return [
      this.x,
      this.y,
      this.z,
    ];
  }
}