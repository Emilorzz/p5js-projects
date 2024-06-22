class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.neighbors = [];
  }

  show() {
    let col;
    let validNeighbors = this.neighbors.filter((neighbor) => !visited.includes(neighbor));

    if (this === current && !finished) {
      col = color(255, 0, 255);
    } else {
      if (validNeighbors.length > 0) {
        col = visited.includes(this) ? color(255, 255, 0) : color(100);
      } else {
        col = 255;
      }
    }

    fill(col);
    stroke(0);
    strokeWeight(size * 0.1);
    strokeCap(SQUARE);

    push();
    noStroke();
    rect(this.x * size, this.y * size, size, size);
    pop();

    // draw wall between cell and neighbor
    for (let neighbor of this.neighbors) {
      if (neighbor.x === this.x + 1) {
        line((this.x + 1) * size, this.y * size, (this.x + 1) * size, (this.y + 1) * size);
      } else if (neighbor.y === this.y + 1) {
        line(this.x * size, (this.y + 1) * size, (this.x + 1) * size, (this.y + 1) * size);
      }
    }
  }
}
