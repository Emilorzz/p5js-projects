class Boid {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().setMag(random(2, maxSpeed));
    this.acc = createVector();

    this.size = sizeMin;
    this.vision = 40;
    this.neighbors = [];

    this.hue = random(360);
    this.sat = 0;
  }

  show() {
    let angle = this.vel.heading();

    // change saturation based on amount of neighboring boids in sight
    this.sat = lerp(this.sat, map(this.neighbors.length, nMin, nMax, -100, 200), lerpSpeed);

    noStroke();
    fill(this.hue, this.sat, 100);

    // draw triangle facing velocity vector
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    triangle(this.size / 2, 0, -this.size / 2, -this.size / 2, -this.size / 2, this.size / 2);
    pop();
  }

  rules() {
    // executes as flocking rules by adding their vectors to the acceleration vector
    this.acc.add(this.avoid().mult(2));
    this.acc.add(this.match().mult(1.5));
    this.acc.add(this.proximity().mult(1));

    this.acc.add(this.mouse());
  }

  update() {
    // update position and velocity, and resets acceleration vector
    this.pos.add(this.vel);
    this.vel.add(this.acc).limit(maxSpeed);
    this.acc.mult(0);

    this.edgeWrapping();

    // changes size based on number of neighbors
    this.size = lerp(
      this.size,
      constrain(map(this.neighbors.length, nMin, nMax, sizeMin, sizeMax), sizeMin, sizeMax),
      lerpSpeed
    );
  }

  edgeWrapping() {
    if (this.pos.x > width + this.size / 2) this.pos.x = -this.size / 2;
    if (this.pos.x < 0 - this.size / 2) this.pos.x = width;
    if (this.pos.y > height + this.size / 2) this.pos.y = -this.size / 2;
    if (this.pos.y < 0 - this.size / 2) this.pos.y = height;
  }

  getNeighbors() {
    this.neighbors = [];

    // finds neighboring boids within vision
    for (let boid of boids) {
      let d = dist(this.pos.x, this.pos.y, boid.pos.x, boid.pos.y);

      if (boid != this && d < this.vision) {
        this.neighbors.push(boid);
      }
    }
  }

  mouse() {
    // calculates force towards mouse cursor.
    if (mouseIsPressed) {
      let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
      let direction = p5.Vector.sub(createVector(mouseX, mouseY), this.pos)
        .setMag(maxSpeed * constrain(map(d, 0, radius + addition, 100, 1), 1, 10))
        .sub(this.vel)
        .limit(maxForce * 10);

      direction = direction.mult(constrain(map(d, 0, radius + addition, 1, 0), 0, 1));

      if (mouseIsPressed) {
        addition += 0.01;
      }

      // add or subtract vector
      return mouseButton == LEFT ? direction : direction.mult(-1);
    }
  }

  avoid() {
    let direction = createVector();

    // wanting to steer away from all neighbors, we return average vector between them
    for (let boid of this.neighbors) {
      let d = dist(this.pos.x, this.pos.y, boid.pos.x, boid.pos.y);
      let diff = p5.Vector.sub(this.pos, boid.pos).div(d * d);
      direction.add(diff);
    }

    let n = this.neighbors.length;
    if (n > 0) {
      direction.div(n).setMag(maxSpeed).sub(this.vel).limit(maxForce);
    }

    return direction;
  }

  match() {
    let direction = createVector();

    // adds the average velocity of each neighboring boid to steer in their general direction
    for (let boid of this.neighbors) {
      direction.add(boid.vel);
    }

    let n = this.neighbors.length;
    if (n > 0) {
      direction.div(n).setMag(maxSpeed).sub(this.vel).limit(maxForce);
    }

    return direction;
  }

  proximity() {
    let direction = createVector();

    // to make boids stick together, the average of all neighbors positions are added
    for (let boid of this.neighbors) {
      direction.add(boid.pos);
    }

    let n = this.neighbors.length;
    if (n > 0) {
      direction.div(n).sub(this.pos).setMag(maxSpeed).sub(this.vel).limit(maxForce);
    }

    return direction;
  }
}
