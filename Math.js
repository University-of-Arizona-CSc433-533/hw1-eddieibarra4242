class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static fromArray = (arr) => {
        return new Vec2(arr[0], arr[1]);
    }

    clamp = (lower, upper) => {
        let x = this.x;
        let y = this.y; 

        if (this.x < lower) x = lower;
        else if (this.x > upper) x = upper;

        if (this.y < lower) y = lower;
        else if (this.y > upper) y = upper;

        return new Vec2(x, y);
    }

    scale = (scalar) => {
        this.x *= scalar;
        this.y *= scalar;
    }

    scaled = (scalar) => {
        return new Vec2(scalar * this.x, scalar * this.y);
    }

    plus = (other) => {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    static add = (v1, v2) => {
        return new v1.plus(v2);
    }

    minus = (other) => {
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    static subtract = (v1, v2) => {
        return v1.minus(v2);
    }

    neg = () => {
        this.x = -this.x;
        this.y = -this.y;
    }

    inverse = () => {
        return new Vec2(-this.x, -this.y);
    }

    dot = (other) => {
        return this.x * other.x + this.y * other.y;
    }

    normSq = () => {
        return this.x * this.x + this.y * this.y;
    }

    norm = () => {
        return Math.sqrt(this.normSq());
    }

    normalized = () => {
        const norm = this.norm();
        return new Vec2(this.x / norm, this.y / norm);
    }

    dist = (other) => {
        return this.minus(other).norm();
    }

    static distance = (v1, v2) => {
        return v1.dist(v2);
    }

    equals = (other) => {
        return this.x === other.x && this.y === other.y;
    }

    static equal = (v1, v2) => {
        return v1.eq(v2);
    }

    str = () => {
        return `(${this.x}, ${this.y})`;
    }

    static zero = () => {
        return new Vec2(0, 0);
    }

    static unitNorm = (v) => {
        const tolerance = 0.0001;
        return Math.abs(v.normSq() - 1) < tolerance;
    }

}


class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static fromArray = (arr) => {
        return new Vec3(arr[0], arr[1], arr[2]);
    }

    clamp = (lower, upper) => {
        let x = this.x;
        let y = this.y; 
        let z = this.z;
        if (this.x < lower) x = lower;
        else if (this.x > upper) x = upper;

        if (this.y < lower) y = lower;
        else if (this.y > upper) y = upper;

        if (this.z < lower) z = lower;
        else if (this.z > upper) z = upper;

        return new Vec3(x, y, z);
    }

    toArray = () => {
        return [this.x,this.y,this.z];
    }

    toRgba = () => {
        return Rgba.fromArray(this.toArray());
    }

    scale = (scalar) => {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }

    scaled = (scalar) => {
        return new Vec3(scalar * this.x, scalar * this.y, scalar * this.z);
    }

    plus = (other) => {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    static add = (v1, v2) => {
        return new v1.plus(v2);
    }

    minus = (other) => {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    static subtract = (v1, v2) => {
        return v1.minus(v2);
    }

    neg = () => {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    inverse = () => {
        return new Vec3(-this.x, -this.y, -this.z);
    }

    dot = (other) => {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross = (other) => {
        return new Vec3(this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x);
    }

    normSq = () => {
        return this.dot(this);
    }

    norm = () => {
        return Math.sqrt(this.normSq());
    }

    normalized = () => {
        const norm = this.norm();
        return new Vec3(this.x / norm, this.y / norm, this.z / norm);
    }

    dist = (other) => {
        return this.minus(other).norm();
    }

    static distance = (v1, v2) => {
        return v1.dist(v2);
    }

    equals = (other) => {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    static equal = (v1, v2) => {
        return v1.eq(v2);
    }

    str = () => {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }

    static zero = () => {
        return new Vec3(0, 0, 0);
    }

    static unitNorm = (v) => {
        const tolerance = 0.0001;
        return Math.abs(v.normSq() - 1) < tolerance;
    }
}

class Matrix3 {
    constructor() {
        this.mat = new Array(9);
        this.load_identity();
    }

    load_identity = () => {
        this.mat[0 + 0 * 3] = 1.; this.mat[1 + 0 * 3] = 0.; this.mat[2 + 0 * 3] = 0.;
        this.mat[0 + 1 * 3] = 0.; this.mat[1 + 1 * 3] = 1.; this.mat[2 + 1 * 3] = 0.;
        this.mat[0 + 2 * 3] = 0.; this.mat[1 + 2 * 3] = 0.; this.mat[2 + 2 * 3] = 1.;
        return this;
    }

    load_translate = (x, y) => {
        this.mat[0 + 0 * 3] = 1.; this.mat[1 + 0 * 3] = 0.; this.mat[2 + 0 * 3] = x;
        this.mat[0 + 1 * 3] = 0.; this.mat[1 + 1 * 3] = 1.; this.mat[2 + 1 * 3] = y;
        this.mat[0 + 2 * 3] = 0.; this.mat[1 + 2 * 3] = 0.; this.mat[2 + 2 * 3] = 1.;
        return this;
    }

    load_rotation = (angle) => {
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        this.mat[0 + 0 * 3] = cos; this.mat[1 + 0 * 3] = -sin; this.mat[2 + 0 * 3] = 0;
        this.mat[0 + 1 * 3] = sin; this.mat[1 + 1 * 3] = cos; this.mat[2 + 1 * 3] = 0;
        this.mat[0 + 2 * 3] = 0.; this.mat[1 + 2 * 3] = 0.; this.mat[2 + 2 * 3] = 1.;
        return this;
    }

    load_scale = (sx, sy) => {
        this.mat[0 + 0 * 3] = sx; this.mat[1 + 0 * 3] = 0.; this.mat[2 + 0 * 3] = 0.;
        this.mat[0 + 1 * 3] = 0.; this.mat[1 + 1 * 3] = sy; this.mat[2 + 1 * 3] = 0.;
        this.mat[0 + 2 * 3] = 0.; this.mat[1 + 2 * 3] = 0.; this.mat[2 + 2 * 3] = 1.;
        return this;
    }

    static mul_mats = (left, right) => {
        let result = new Matrix3();
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                result.mat[x + y * 3] =
                    left.mat[0 + y * 3] * right.mat[x + 0 * 3] +
                    left.mat[1 + y * 3] * right.mat[x + 1 * 3] +
                    left.mat[2 + y * 3] * right.mat[x + 2 * 3];
            }
        }

        return result;
    }

    static mul_vec = (mat, vec) => {
        let row0 = new Vec3(mat.mat[0], mat.mat[1], mat.mat[2]);
        let row1 = new Vec3(mat.mat[3], mat.mat[4], mat.mat[5]);
        let row2 = new Vec3(mat.mat[6], mat.mat[7], mat.mat[8]);

        return new Vec3(
            vec.dot(row0),
            vec.dot(row1),
            vec.dot(row2)
        );

    }
}

round = (x) => Math.floor(x + 0.5)