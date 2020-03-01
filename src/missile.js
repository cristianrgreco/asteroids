import Vector from "./vector";

const SIZE = 5;
const SPEED = 3;

export default class Missile {
    constructor(pos, rot) {
        this.pos = pos;
        this.rot = rot;
        this.vel = new Vector(
            SPEED * Math.cos(this.rot),
            SPEED * Math.sin(this.rot)
        );
    }

    update() {
        this.pos.add(this.vel);
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rot);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(SIZE, 0);
        ctx.closePath();

        ctx.strokeStyle = '#000';
        ctx.stroke();

        ctx.restore();
    }
}
