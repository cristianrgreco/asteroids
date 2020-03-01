export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(another) {
        this.x += another.x;
        this.y += another.y;
    }

    rotate(radians) {
        this.x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
        this.y = this.x * Math.sin(radians) + this.y * Math.cos(radians);
    }
}