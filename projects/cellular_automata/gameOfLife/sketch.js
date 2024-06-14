// MOUSE    - DRAW CELLS
// SCROLL   - INCREASE / DECREASE SIMULATION
// SPACEBAR - PAUSE / UNPAUSE SIMULATION
// N        - STEP TO NEXT FRAME
// C        - COLOR CELLS BASED ON ALIVE NEIGHBORS
// G        - SHOW GRID

let size = 20;
let grid = [];
let cell;
let paused = true;
let freq = 5;
let show = true;
let sat = 0;
let strk = 2;
let showLines = false;

function setup() {
  createCanvas(floor(windowWidth / size) * size, floor(windowHeight / size) * size);
  noStroke();

  initGrid();
}

function draw() {
  background(0);
  drawGrid();

  if (showLines) {
    drawLines();
  }
  drawStatus();

  if (!paused && frameCount % freq == 0) {
    updateGrid();
  }
}

function initGrid() {
  paused = true;
  for (let x = 0; x < width / size; x++) {
    grid[x] = [];
    for (let y = 0; y < height / size; y++) {
      grid[x][y] = new Cell(x * size, y * size, false);
    }
  }

  for (let i = 0; i < width / size; i++) {
    for (let j = 0; j < height / size; j++) {
      grid[i][j].neighbors = initNeighbors(i, j);
    }
  }
}

function initNeighbors(x, y) {
  let neighbors = [];

  for (let nx = -1; nx <= 1; nx++) {
    for (let ny = -1; ny <= 1; ny++) {
      if (nx == 0 && ny == 0) {
        continue;
      }
      if (onGrid(x + nx, y + ny)) {
        neighbors.push(grid[x + nx][y + ny]);
      }
    }
  }

  return neighbors;
}

function onGrid(x, y) {
  return x >= 0 && y >= 0 && x < grid.length && y < grid[x].length;
}

function drawStatus() {
  push();
  fill(50, 0, 200);

  if (frameCount % 30 == 0) show = !show;

  if (show) {
    if (paused) {
      rect(25, 25, 50, 50 / 3);
      rect(25, 50, 50, 50 / 3);
    } else {
      triangle(25, 25, 25, 75, 75, 50);
    }
  }

  pop();
}

function drawGrid() {
  for (let i = 0; i < width / size; i++) {
    for (let j = 0; j < height / size; j++) {
      grid[i][j].show();
    }
  }
}

function drawLines() {
  push();
  strokeWeight(size / 10);
  stroke(50);
  for (let i = 0; i <= width; i += size) {
    line(0, i, width, i);
  }
  for (let i = 0; i <= width; i += size) {
    line(i, 0, i, height);
  }
  pop();
}

function updateGrid() {
  for (let i = 0; i < width / size; i++) {
    for (let j = 0; j < height / size; j++) {
      grid[i][j].update();
    }
  }

  for (let i = 0; i < width / size; i++) {
    for (let j = 0; j < height / size; j++) {
      grid[i][j].alive = grid[i][j].nextState;
    }
  }
}

function mouseDragged() {
  for (let i = 0; i < width / size; i++) {
    for (let j = 0; j < height / size; j++) {
      if (grid[i][j].collision() && !grid[i][j].visited) {
        grid[i][j].visited = true;
        grid[i][j].alive = !grid[i][j].alive;
      }
    }
  }
}

function mousePressed() {
  for (let i = 0; i < width / size; i++) {
    for (let j = 0; j < height / size; j++) {
      if (grid[i][j].collision() && !grid[i][j].visited) {
        grid[i][j].visited = true;
        grid[i][j].alive = !grid[i][j].alive;
      }
    }
  }
}

function mouseReleased() {
  for (let i = 0; i < width / size; i++) {
    for (let j = 0; j < height / size; j++) {
      grid[i][j].visited = false;
    }
  }
}

function keyPressed() {
  if (keyCode == 82) {
    paused = true;
    initGrid();
  }
  if (keyCode == 32) {
    paused = !paused;
    show = true;
  }
  if (keyCode == 78 && paused) {
    updateGrid();
  }
  if (keyCode == 67) {
    if (sat == 100) {
      sat = 0;
    } else {
      sat = 100;
    }
  }
  if (keyCode == 71) {
    showLines = !showLines;
  }
}

function mouseWheel(event) {
  if (event.delta > 0) {
    scale(++freq);
  } else {
    scale(--freq);
  }

  freq = constrain(freq, 1, 60);
}

function doubleClicked() {
  paused = !paused;
  show = true;
}
