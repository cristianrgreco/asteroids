import Missile from './missile'
import Vector from "./vector";

const SIZE = 50;
const MOVE_SPEED = 1;
const TICK_MOVE_TIMEOUT = 10;
const TICK_SHOT_TIMEOUT = 10;

export default class Ship {
    constructor(pos, rot) {
        this.pos = pos;
        this.rot = rot;
        this.vel = new Vector(0, 0);
        this.lastMoveTick = -Infinity;
        this.lastShotTick = -Infinity;
    }

    update(world) {
        this._rotate(world);

        this.pos.add(this.vel);

        if (this._isMoving(world) && this._canMove(world)) {
            this._move(world);
        }
        if (this._isShooting(world) && this._canShoot(world)) {
            this._shoot(world);
        }
    }

    _rotate(world) {
        const x = world.mousePos.x - this.pos.x;
        const y = world.mousePos.y - this.pos.y;

        this.rot = Math.atan2(y, x) + (Math.PI / 2);
    }

    _isMoving(world) {
        return world.keysPressed.has(' ');
    }

    _canMove(world) {
        return world.ticks > (this.lastMoveTick + TICK_MOVE_TIMEOUT);
    }

    _move(world) {
        this.lastMoveTick = world.ticks;

        this.vel.add(new Vector(
            MOVE_SPEED * Math.cos(this.rot - (Math.PI / 2)),
            MOVE_SPEED * Math.sin(this.rot - (Math.PI / 2))
        ));
    }

    _isShooting(world) {
        return world.isLeftMouseButtonClicked;
    }

    _canShoot(world) {
        return world.ticks > (this.lastShotTick + TICK_SHOT_TIMEOUT);
    }

    _shoot(world) {
        this.lastShotTick = world.ticks;
        world.sounds.pew();
        world.missiles.push(new Missile(new Vector(this.pos.x, this.pos.y), this.rot - (Math.PI / 2)));
    }

    draw(ctx) {
        this._drawShip(ctx);
    }

    _drawShip(ctx) {
        ctx.save();

        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rot);

        ctx.beginPath();
        ctx.moveTo(0, -SIZE / 2);
        ctx.lineTo(-SIZE / 3, SIZE / 3);
        ctx.lineTo(SIZE / 3, SIZE / 3);
        ctx.closePath();

        ctx.strokeStyle = '#000';
        ctx.stroke();

        ctx.restore();
    }
}
