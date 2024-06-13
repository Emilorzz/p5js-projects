// mouseY determines saturation while mouse is pressed
// use scroll wheel to increase/decrease speed

let stars = [];
let minSpd = 100;
let maxSpd = 1000;
let spd = minSpd;
let scrollStep = 5;
let size = 1;
let factor;
let ranges = { h: 360, s: 100, b: { l: 70, r: 100 } };
let sat = 0;
let scale = 50;
let intensity = 0.3;
let angle, angleStep;

document.addEventListener("touchstart", {});

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB);
  angleMode(DEGREES);
  angle = 0;
  angleStep = 0.1;

  factor = width * 0.1;

  for (let i = 0; i < 2000; i++) {
    stars[i] = createVector(
      random(-width * scale, width * scale) * factor,
      random(-width * scale, width * scale) * factor,
      random(10, width * scale)
    );
    stars[i].d = random(size * 0.1, size * 0.5);

    stars[i].h = random(ranges.h);
    stars[i].s = sat;
    stars[i].b = random(ranges.b.l, ranges.b.r);
    stars[i].pz = stars[i].z;
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  rotate(angle);
  angle = (angle + angleStep) % 360;

  for (let star of stars) {
    let divisor = star.z * intensity;
    let pdivisor = star.pz * intensity;
    let x = star.x / divisor;
    let y = star.y / divisor;
    let px = star.x / pdivisor;
    let py = star.y / pdivisor;
    star.b = random(ranges.b.l, ranges.b.r);
    let d = map(star.z, 10, width * scale, star.d * 10, 0);
    stroke(star.h, sat, star.b);
    push();
    strokeWeight(d);
    line(x, y, px, py);
    pop();
    noStroke();
    fill(star.h, sat, star.b);
    circle(x, y, d);

    if (mouseIsPressed) {
      let expX = pow(map(spd, minSpd, maxSpd, 0, 1, true), 5);

      intensity = map(expX, 0, 1, 0.3, 5, true);
      spd = map(mouseX, 0, width, minSpd, maxSpd, true);
      sat = map(expX, 0, 1, 0, 300);
    }

    star.pz = star.z;
    star.z -= spd;

    if (star.z < 1) {
      star.x = random(-width * scale, width * scale) * factor;
      star.y = random(-width * scale, width * scale) * factor;
      let newZ = width * scale;
      star.z = newZ;
      star.pz = newZ;
      star.d = random(size * 0.1, size * 0.5);

      star.h = random(ranges.h);
      star.s = sat;
      star.b = random(ranges.b.l, ranges.b.r);
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
