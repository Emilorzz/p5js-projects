class Cell {
  constructor(x, y, alive) {
    this.x = x;
    this.y = y;
    this.alive = alive;
    this.nextState = this.alive;
    this.neighbors = [];
    this.visited = false;
  }

  update() {
    this.nextState = this.alive;
    if (!this.alive) {
      if (this.aliveNeighbors() == 3) {
        // reproduction
        this.nextState = true;
      }
    } else {
      if (this.aliveNeighbors() > 3) {
        // overpopulation
        this.nextState = false;
      } else if (this.aliveNeighbors() < 2) {
        // underpopulation
        this.nextState = false;
      }
    }
    this.visited = false;
  }

  show() {
    if (this.alive) {
      push();
      colorMode(HSB);
      fill(0);
      fill(map(this.aliveNeighbors(), 0, 8, 255, 0), sat, 100);
      rect(this.x, this.y, size);
      pop();
    } else {
      fill(0);
      rect(this.x, this.y, size);
    }
  }

  collision() {
    if (mouseX >= this.x && mouseX < this.x + size && mouseY >= this.y && mouseY < this.y + size) {
      return true;
    }

    return false;
  }

  aliveNeighbors() {
    let result = 0;

    for (cell of this.neighbors) {
      if (cell.alive) {
        result++;
      }
    }

    return result;
  }
}
