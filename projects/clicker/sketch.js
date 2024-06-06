// clicker game


// Click THE SOURCE to gain Polka Dots.

// THE SOURCE awards you with polka dots.
// The size of the payout is based on the percentage size of THE SOURCE.
// The percentage size is displayed at the bottom of THE SOURCE.
// The max size of THE SOURCE is displayed as a circle around it.
// If THE SOURCE reaches its max size, you are penalized and it relocates.

let source, sourceX, sourceY;
let sourceSize, minSize, maxSize;
let sourceScale = 1;
let scaleText = 0, percentageText = 0;
let scaleVelocity = 1;
let scaleAcceleration = 0.1;

let penalty = false, moved = false;

let amount, balance = 0;
let amountStep, amountActual = 0;
let percentage;

let auto = false;
let frequency = 0.35;

let dots = [];
let hue, sat, br;

let bgColor, textColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  noStroke();

  minSize = min(width, height) * 0.1;
  maxSize = min(width, height) * 0.2;
  sourceSize = minSize;
  sourceX = width / 2;
  sourceY = height / 2;
  amountStep = 10;
  percentage = 0;
  bgColor = color(0, 0, 0);
  textColor = color(0, 0, 100);

  hue = random(0, 360);
}

function draw() {

  background(bgColor);

  drawDots();
  drawSource();
  drawAmount();

  if (auto) {
    autoClick();
  }
}

function drawDots() {
  push();
  for (let i = 0; i < dots.length; i++) {
    dots[i].show();
    dots[i].update();

    if (dots[i].y > height + dots[i].s || percentage == 0) {
      dots.splice(i, 1);
    }
  }

  pop();
}

function drawSource() {
  if (penalty) {
    scaleVelocity = 0.5;
    hue = 0;
    bgColor = lerpColor(color(0, 0, 0), color(0, 0, 100), percentage / 100);
    textColor = lerpColor(color(0, 0, 100), color(0, 0, 0), percentage / 100);
    sat = lerp(100, 0, percentage / 100);
  } else {
    sat = percentage;
  }
  br = percentage;

  minSize = min(width, height) * 0.15;
  maxSize = min(width, height) * 0.25;
  percentage = map(sourceSize, minSize, maxSize, 0, 100);

  source = {
    x: sourceX,
    y: sourceY,
    r: sourceSize,
    c: color(hue, sat, 100),
  };

  push();

  noStroke();
  translate(source.x, source.y);
  scale(sourceScale);
  fill(hue, 0, 100, (penalty ? 0 : (percentage / 100) / 2));
  circle(0, 0, maxSize * 2);
  fill(source.c);
  circle(0, 0, source.r * 2);

  if (frameCount % (penalty ? 1 : 2) == 0) {
    amountActual = amountStep * (percentage / 100);
    scaleText = amountActual < 1000 ? nf(amountActual, 0, (amountActual % 1 == 0 ? 0 : 1)) : formatExpo(amountActual);
    percentageText = percentage;
  }

  fill((hue + 180) % 360, sat, br, percentage / 100);
  textAlign(CENTER, CENTER);
  textSize(sourceSize * (amountActual < 1000 ? 0.5 : 0.3));
  textStyle(BOLD);
  text(scaleText, 0, 0);
  textAlign(CENTER, TOP);
  fill(0, 0, br, percentage / 100);
  textSize(sourceSize * 0.2);
  text(nf(percentageText, 0, 0) + "%", 0, sourceSize * 0.7);
  pop();

  if (sourceSize == maxSize) {
    penalty = true;
    if (!moved) {
      moved = true;
      moveSource();
    }
  } else if (sourceSize == minSize) {
    penalty = false;
    moved = false;
  }

  sourceSize -= scaleVelocity;
  scaleVelocity += scaleAcceleration;

  sourceSize = constrain(sourceSize, minSize, maxSize);
}

function moveSource() {
  let newX, newY, distToNew;
  let attempts = 0;

  do {
    newX = random(0 + sourceSize * 1.1, width - sourceSize * 1.1);
    newY = random(height * 0.1 + sourceSize * 1.1, height - sourceSize * 1.1);
    distToNew = dist(newX, newY, mouseX, mouseY);
    attempts++;
  } while (distToNew < sourceSize && attempts < 10);

  print(attempts);

  sourceX = newX;
  sourceY = newY;
}

function drawAmount() {
  amount = {
    v: nf(balance, 0, 1),
    x: width / 2,
    y: 100,
    s: min(width, height) * 0.08,
  };

  push();

  fill(textColor);
  textAlign(CENTER)
  textSize(amount.s)
  text(formatExpo(amount.v), amount.x, amount.y);
  textSize(amount.s * 0.5)
  text("Polka dot" + (amount.v == 1 ? "" : "s"), amount.x, amount.y + amount.s);

  pop();
}

function formatExpo(number) {
  return number < 1000 ? number : Number.parseFloat(number).toExponential(2);
}

function clickSource() {
  if (!penalty) {
    let reward = amountStep * percentage / 100;
    balance += reward;
    hue = random(0, 360);
    scaleVelocity = -1;

    for (let i = 0; i < percentage; i++) {
      dots.push(new Dot());
    }
  }
}

function autoClick() {
  if (frameCount % round(60 * frequency) == 0) {
    clickSource();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  let distToSource = dist(source.x, source.y, mouseX, mouseY);
  if (distToSource < source.r) {
    clickSource();
  }
}

function keyPressed() {
  switch (keyCode) {
    case 32:
      auto = !auto;
      break;
  }
}