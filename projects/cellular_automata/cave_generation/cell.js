class Cell {
  constructor(x, y, isWall) {
    this.x = x;
    this.y = y;
    this.isWall = isWall;
    this.isWallNext = false;
    this.neighbors = [];
  }

  show() {
    fill(this.isWall ? color(40, 20, 40) : color(120, 100, 120));
    stroke(this.isWall ? color(20, 0, 20) : color(100, 80, 100));
    rect(this.x * size, this.y * size, size);
  }

  update() {
    let wallCount = this.countWallNeighbors(true);

    this.isWallNext = wallCount >= 5 ? true : false;
  }

  countWallNeighbors(countSelf) {
    let wallCount = 0;

    if (countSelf && this.isWall) wallCount++;

    for (let neighbor of this.neighbors) {
      if (neighbor.isWall) {
        wallCount++;
      }
    }
    // adjust for walls outside of canvas. This makes walls much more likely along edges
    wallCount += 8 - this.neighbors.length;

    return wallCount;
  }
}
