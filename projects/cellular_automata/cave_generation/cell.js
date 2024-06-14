class Cell {
  constructor(x, y, isWall) {
    this.x = x;
    this.y = y;
    this.isWall = isWall;
    this.isWallNext = false;
    this.neighbors = [];
  }

  show() {
    if (this.isWall) {
      fill(20);
      rect(this.x * size, this.y * size, size);
    }
  }

  update() {
    if (currIter <= numIter) {
      let wallCount = this.countWallNeighbors(true);

      this.isWallNext = wallCount >= 5 || this.onEdge() ? true : false;
    }
  }

  onEdge() {
    return this.x == 0 || this.x == cols - 1 || this.y == 0 || this.y == rows - 1;
  }

  countWallNeighbors(countSelf = false) {
    let wallCount = 0;

    if (countSelf && this.isWall) wallCount++;

    for (let neighbor of this.neighbors) {
      if (neighbor.isWall) {
        wallCount++;
      }
    }
    return wallCount;
  }
}
