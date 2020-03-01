import Vector from "./vector";

const MIN_SIZE = 25;
const MAX_SIZE = 50;
const MAX_SPEED = 3;

export default class Asteroid {
    constructor(pos, size = this._randomSize(), vel = this._randomVelocity()) {
        this.startPos = new Vector(pos.x, pos.y);
        this.pos = pos;
        this.size = size;
        this.vel = vel;
        this.canBeReflected = false;
        this.hasReflected = false;
    }

    _randomSize() {
        return (Math.random() * MAX_SIZE) + MIN_SIZE;
    }

    _randomVelocity() {
        const speed = Math.random() * MAX_SPEED;
        const rot = Math.random() * 2 * Math.PI;
        return new Vector(speed * Math.cos(rot), speed * Math.sin(rot));
    }

    update(world) {
        this.pos.add(this.vel);

        if (this._isOutsideFrame(world)) {
            this._removeAsteroid(world);
            return;
        }

        if (!this._isPartiallyOutsideFrame(world)) {
            this.canBeReflected = true;
        }

        if (this.canBeReflected && !this.hasReflected && this._isPartiallyOutsideFrame(world)) {
            this.hasReflected = true;
            world.asteroids.push(new Asteroid(this._calculateReflectedStartPos(world), this.size, this.vel));
        }

        if (this._isHit(world)) {
            this._removeMissile(world);
            this._breakAsteroid(world);
        }
    }

    _calculateReflectedStartPos(world) {
        const negativeVel = new Vector(this.vel.x, this.vel.y).invert();
        const startPos = new Vector(this.startPos.x, this.startPos.y);

        const isOutsideWorld = () => {
            return startPos.x + this.size <= 0 ||
                startPos.x - this.size > world.width ||
                startPos.y + this.size <= 0 ||
                startPos.y - this.size > world.height
        };

        while (!isOutsideWorld()) {
            startPos.add(negativeVel);
        }

        return startPos;
    }

    _isOutsideFrame(world) {
        return this.pos.x + this.size <= 0 ||
            this.pos.x - this.size > world.width ||
            this.pos.y + this.size <= 0 ||
            this.pos.y - this.size > world.height
    }

    _isPartiallyOutsideFrame(world) {
        return this.pos.x - this.size < 0 ||
            this.pos.x + this.size > world.width ||
            this.pos.y - this.size < 0 ||
            this.pos.y + this.size > world.height
    }

    _removeAsteroid(world) {
        const index = world.asteroids.findIndex(asteroid => asteroid === this);
        world.asteroids.splice(index, 1);
    }

    _isHit(world) {
        return world.missiles.some(missile => {
            const distance = Math.sqrt(
                Math.pow(missile.pos.x - this.pos.x, 2) + Math.pow(missile.pos.y - this.pos.y, 2)
            );
            return distance < this.size;
        });
    }

    _removeMissile(world) {
        const missileIndex = world.missiles.findIndex(missile => missile === this._getMissile(world));
        world.missiles.splice(missileIndex, 1);
    }

    _getMissile(world) {
        return world.missiles.find(missile => {
            const distance = Math.sqrt(
                Math.pow(missile.pos.x - this.pos.x, 2) + Math.pow(missile.pos.y - this.pos.y, 2)
            );
            return distance < this.size;
        });
    }

    _breakAsteroid(world) {
        this._removeAsteroid(world);

        const createNew = offset => new Asteroid(new Vector(this.pos.x, this.pos.y).add(offset), this.size / 4);

        world.asteroids.push(createNew(new Vector(-(this.size / 2), -(this.size / 2))));
        world.asteroids.push(createNew(new Vector(0, -(this.size / 2))));
        world.asteroids.push(createNew(new Vector(-(this.size / 2), -0)));
        world.asteroids.push(createNew(new Vector(+(this.size / 2), +(this.size / 2))));
    }

    draw(ctx) {
        ctx.save();

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.strokeStyle = '#000';
        ctx.stroke();

        ctx.restore();
    }
}