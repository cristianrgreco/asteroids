import Vector from './vector';
import Ship from "./ship";

const WIDTH = 900;
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

const world = {
    ticks: 0,
    isLeftMouseButtonClicked: false,
    mousePos: {x: 0, y: 0},
    keysPressed: new Set(),
    ship: new Ship(new Vector(100, 100), 0),
    missiles: []
};

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
}

function draw() {
    clear();
    border();
    world.ship.draw(ctx);
    world.missiles.forEach(missile => missile.draw(ctx));
}

setInterval(() => {
    update();
    draw();
}, 1000 / 60);
