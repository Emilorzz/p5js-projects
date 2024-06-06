// mouseY determines saturation while mouse is pressed
// use scroll wheel to increase/decrease speed 

let stars = [];
let minSpd = 1;
let maxSpd = 100;
let spd = minSpd;
let scrollStep = 5;
let size = 1;
let factor;
let ranges = { h: 360, s: 100, b: { l: 70, r: 100 } };
let sat = 0;

document.addEventListener('touchstart', {});

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB);

  factor = width * 0.5;

  for (let i = 0; i < 1000; i++) {
    stars[i] = createVector(
      random(-width, width) * factor,
      random(-height, height) * factor,
      random(10, width));
    stars[i].d = random(size * 0.5, size * 5);

    stars[i].h = random(ranges.h);
    stars[i].s = sat;
    stars[i].b = random(ranges.b.l, ranges.b.r);
    stars[i].pz = stars[i].z;
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  for (let star of stars) {
    let x = star.x / star.z;
    let y = star.y / star.z;
    let px = star.x / star.pz;
    let py = star.y / star.pz;
    star.b = random(ranges.b.l, ranges.b.r);
    let d = map(star.z, 0, width, star.d, 0);
    stroke(star.h, sat, star.b);
    push();
    strokeWeight(d);
    line(x, y, px, py);
    pop();
    fill(star.h, sat, star.b);
    circle(x, y, d);

    if (mouseIsPressed) {
      spd = constrain(map(mouseX, 0, width, minSpd, maxSpd), minSpd, maxSpd);
      sat = map(mouseY, 0, height, 100, 0);
    }

    star.pz = star.z;
    star.z -= spd;

    if (star.z < 10) {
      star.x = random(-width, width) * factor;
      star.y = random(-height, height) * factor;
      star.h = random(ranges.h);
      star.s = sat;
      star.b = random(ranges.b.l, ranges.b.r);
      star.z = width;
      star.pz = width;
    }
  }
}

function mouseWheel(event) {
  if (event.delta > 0) {
    spd -= scrollStep;
  } else {
    spd += scrollStep;
  }

  spd = constrain(spd, minSpd, maxSpd);
}
