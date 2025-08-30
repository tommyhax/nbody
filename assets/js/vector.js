const __DIMENSION = 2;

const Vector = function (components) {
    if (!Array.isArray(components)) {
        throw new TypeError("Vector expects an array");
    }
    if (components.length !== __DIMENSION) {
        throw new RangeError("Vector dimension");
    }

    this.components = components.slice();
}

Vector.zeroVector = function () {
    return new Vector(Array.from({ length: __DIMENSION }, () => 0));
}

Vector.randomSurfaceVector = function (radius = 1) { 
    let v = new Vector(Array.from({ length: __DIMENSION }, gauss));
    return v.mul(radius / v.norm());
} 
 
Vector.randomVolumeVector = function (radius = 1) {
    return Vector.randomSurfaceVector(radius).mul(Math.pow(Math.random(), 1 / __DIMENSION));
}

Vector.zipWith = function (u, v, fn) { 
    return new Vector(u.components.mapWith(v.components, fn));
}

Vector.prototype.add = function (v) {
    return Vector.zipWith(this, v, (a, b) => a + b);
}

Vector.prototype.sub = function (v) {
    return Vector.zipWith(this, v, (a, b) => a - b);
}

Vector.prototype.mul = function (x) {
    return new Vector(this.components.map(a => a * x));
}

Vector.prototype.div = function (x) {
    return new Vector(this.components.map(a => a / x));
}

Vector.prototype.dot = function (v) {
    return this.components
        .mapWith(v.components, (a, b) => a * b)
        .reduce((sum, x) => sum + x, 0);
}

Vector.prototype.normSquared = function () {
    return this.dot(this);
}

Vector.prototype.norm = function () {
    return Math.sqrt(this.normSquared());
}

