export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        if (typeof other === "number") {
            return new Vec2(this.x + other, this.y + other);
        }
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    subtract(v) {
        if (typeof v === 'number') {
            return new Vec2(this.x - v, this.y - v);
        }
        return new Vec2(this.x - v.x, this.y - v.y);
    }
    multiply(v) {
        if (typeof v === "number") {
            return new Vec2(this.x * v, this.y * v);
        }
        else {
            return new Vec2(this.x * v.x, this.y * v.y);
        }
    }
    divide(v) {
        return new Vec2(v.x === 0 ? 0 : (this.x / v.x), v.y === 0 ? 0 : (this.y / v.y));
    }
    normalise() {
        const mag = this.magnitude;
        return new Vec2(this.x / mag, this.y / mag);
    }
    get magnitude() {
        return Math.sqrt((this.x ** 2) + (this.y ** 2));
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
}
export class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get [0]() {
        return this.x;
    }
    get [1]() {
        return this.y;
    }
    get [2]() {
        return this.z;
    }
    static fromArray(numbers) {
        return new Vec3(...numbers);
    }
    add(other) {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    subtract(other) {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    multiply(other) {
        if (typeof other === "number") {
            return new Vec3(this.x * other, this.y * other, this.z * other);
        }
        else {
            return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
        }
    }
    divide(other) {
        return new Vec3(other.x === 0 ? 0 : (this.x / other.x), other.y === 0 ? 0 : (this.y / other.y), other.z === 0 ? 0 : (this.z / other.z));
    }
    normalise() {
        const mag = this.magnitude;
        return new Vec3(this.x / mag, this.y / mag, this.z / mag);
    }
    get magnitude() {
        return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2));
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        return new Vec3((this.y * v.z) - (this.z * v.y), (this.z * v.x) - (this.x * v.z), (this.x * v.y) - (this.y * v.x));
    }
    toArray() {
        return [
            this.x,
            this.y,
            this.z,
        ];
    }
}
