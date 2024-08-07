// RIGHT CLICK  - Push boids away
// LEFT CLICK   - Attract boids
//    + LCTRL   - Spawn more boids

let w, h;
let boids = [];
let maxSpeed = 5,
  maxForce = 0.2;

let nMin = 0,
  nMax = 10;
let sizeMin = 5,
  sizeMax = 20;

let radius = 100,
  addition = 0;

let lerpSpeed = 1;

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  colorMode(HSB);

  generateBoids(200);
}

function draw() {
  background(0);

  for (let boid of boids) {
    boid.rules();
    boid.getNeighbors();
    boid.update();
    boid.show();
  }
}

function generateBoids(n, x, y) {
  for (let i = 0; i < n; i++) {
    boids.push(new Boid(x, y));
  }
}

function mousePressed() {
  if (keyIsDown(17) && mouseButton == LEFT) {
    generateBoids(50);
  }
}

function mouseReleased() {
  addition = 0;
}

// disable right click, sue me
document.oncontextmenu = function () {
  if (mouseX < width && mouseY < height) return false;
};
