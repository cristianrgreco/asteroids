import Vector from './vector';
import Ship from "./ship";
import Asteroid from "./asteroid";

const WIDTH = 600;
const HEIGHT = 600;

const canvas = document.querySelector('#app');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext('2d');

function clear() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function border() {
    ctx.strokeStyle = '#000';
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);
}

function createWorld() {
    const asteroids = [
        new Asteroid(new Vector(200, 200)),
        // new Asteroid(new Vector(WIDTH, 200))
    ];

    return {
        ticks: 0,
        width: WIDTH,
        height: HEIGHT,
        isGameOver: false,
        isLeftMouseButtonClicked: false,
        mousePos: {x: 0, y: 0},
        keysPressed: new Set(),
        ship: new Ship(new Vector(100, 100), 0),
        missiles: [],
        asteroids
    };
}

let world = createWorld();

document.onmousemove = e => {
    world.mousePos.x = e.x;
    world.mousePos.y = e.y;
};
document.onmousedown = () => world.isLeftMouseButtonClicked = true;
document.onmouseup = () => world.isLeftMouseButtonClicked = false;

document.onkeydown = e => world.keysPressed.add(e.key);
document.onkeyup = e => world.keysPressed.delete(e.key);

function update() {
    world.ticks++;
    world.ship.update(world);
    world.missiles.forEach(missile => missile.update(world));
    world.asteroids.forEach(asteroid => asteroid.update(world));
}

function draw() {
    clear();
    border();
    world.ship.draw(ctx);
    world.missiles.forEach(missile => missile.draw(ctx));
    world.asteroids.forEach(asteroid => asteroid.draw(ctx));
}

setInterval(() => {
    if (!world.isGameOver) {
        update();
        draw();
    }
}, 1000 / 60);
