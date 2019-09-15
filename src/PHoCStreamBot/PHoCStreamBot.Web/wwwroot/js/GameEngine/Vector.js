"use strict";

class Vector {
    static zero = new Vector(0, 0);

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.length = Math.sqrt(this.x * this.x + this.y * this.y);
        //Object.freeze(this);
    }

    static point(x, y) {
        return new Vector(x, y);
    }

    static fromPolar(degrees, distance) {
        // 1° × π/180 
        var radians = degrees * Math.PI / 180;
    
        /* 
         x = r × cos( θ )
         y = r × sin( θ )
        */
        return new Vector(distance * Math.cos(radians), distance * Math.sin(radians));
      }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    multiply(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    divide(factor) {
        return factor !== 0 ? new Vector(this.x / factor, this.y / factor) : this;
    }

    squaredKeepSign() {
        return new Vector(this.x * this.x * Math.sign(this.x), this.y * this.y * Math.sign(this.y));
    }

    normalize(length) {
        let newX = this.getRatioX(length);
        let newY = this.getRatioY(length);
        return new Vector(newX, newY);
    }

    getRatioX(amount) {
        if (this.length === 0) {
            return 0;
        }

        return amount * this.x / this.length;
    }

    getRatioY(amount) {
        if (this.length === 0) {
            return 0;
        }

        return amount * this.y / this.length;
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
}
