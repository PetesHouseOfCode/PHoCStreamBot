"use strict";

class Vector {
    x = 0;
    y = 0;
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static point(x, y) {
        return new Vector(x, y);
    }
}
