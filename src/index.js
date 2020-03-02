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
        new Asteroid(new Vector(50, 50)),
        new Asteroid(new Vector(WIDTH - 50, 50)),
        new Asteroid(new Vector(WIDTH - 150, 150)),
        new Asteroid(new Vector(WIDTH - 150, HEIGHT - 150)),
        new Asteroid(new Vector(50, HEIGHT - 50)),
    ];

    const pewSound = document.querySelector('#pew');
    const boomSound = document.querySelector('#boom');

    return {
        ticks: 0,
        width: WIDTH,
        height: HEIGHT,
        isGameOver: false,
        sounds: {
            pew: () => pewSound.cloneNode(true).play(),
            boom: () => boomSound.cloneNode(true).play(),
        },
        isLeftMouseButtonClicked: false,
        mousePos: {x: 0, y: 0},
        keysPressed: new Set(),
        ship: new Ship(new Vector(WIDTH / 2, HEIGHT / 2), 0),
        missiles: [],
        asteroids
    };
}

document.onmousemove = e => {
    world.mousePos.x = e.x;
    world.mousePos.y = e.y;
};
document.onmousedown = () => world.isLeftMouseButtonClicked = true;
document.onmouseup = () => world.isLeftMouseButtonClicked = false;

document.onkeydown = e => world.keysPressed.add(e.key);
document.onkeyup = e => world.keysPressed.delete(e.key);

let world;

function init() {
    world = createWorld();
}

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

init();

setInterval(() => {
    if (!world.isGameOver) {
        update();
        draw();
    }
}, 1000 / 60);
