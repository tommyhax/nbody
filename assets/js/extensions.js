Array.prototype.mapWith = function (that, fn) {
    if (!Array.isArray(that)) {
        throw new TypeError("Argument must be an array");
    }
    if (this.length !== that.length) {
        throw new RangeError("Arrays must have the same length");
    }

    return this.map((x, i) => fn(x, that[i], i));
};
