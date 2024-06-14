let size, cols, rows;
let grid, coverage, numIter, currIter;

let step;

function setup() {
  size = 20;
  cols = floor(windowWidth / size);
  rows = floor(windowHeight / size);
  coverage = 0.5;
  numIter = 10;

  createCanvas(cols * size, rows * size);

  initGrid();
}

function draw() {
  background(100);

  drawGrid();

  if (currIter <= numIter) {
    step = false;
    updateGrid();
    currIter++;
  } else {
    noLoop();
  }
  print(grid[0][0].neighbors);
}

function initGrid() {
  grid = [];
  currIter = 1;
  step = false;

  cols = floor(windowWidth / size);
  rows = floor(windowHeight / size);

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, false);
    }
  }

  initWalls();
  initNeighbors();
}

function initWalls() {
  let i = 0;
  while (i < floor(cols * rows * coverage)) {
    let x = int(random(cols));
    let y = int(random(rows));

    if (!grid[x][y].isWall) {
      grid[x][y].isWall = true;
      i++;
    }
  }
}

function initNeighbors() {
  let directions;
  directions = [
    { dx: 1, dy: -1 }, // diagonal up-right
    { dx: 0, dy: -1 }, // up
    { dx: -1, dy: 0 }, // left
    { dx: -1, dy: -1 }, // diagonal up-left
    { dx: -1, dy: 1 }, // diagonal down-left
    { dx: 0, dy: 1 }, // down
    { dx: 1, dy: 0 }, // right
    { dx: 1, dy: 1 }, // diagonal down-right
  ];

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].neighbors = [];

      for (let dir of directions) {
        let nx = i + dir.dx;
        let ny = j + dir.dy;

        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          grid[i][j].neighbors.push(grid[nx][ny]);
        }
      }
    }
  }
}

function drawGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
}

function updateGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].update();
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].isWall = grid[i][j].isWallNext;
    }
  }
}

function mouseWheel(event) {
  if (event.delta > 0) {
    size--;
  } else {
    size++;
  }

  loop();
}

function mousePressed() {
  translate(mouseX, mouseY);

  initGrid();
  loop();
}

function keyPressed() {
  switch (keyCode) {
    case 82: // r
      initGrid();
      break;
    case 78:
      step = true;
      break;
  }
}
