let size, cols, rows;

let grid;

let stack, visited;

let start, current;

let finished;

function setup() {
  size = 50;
  cols = floor(windowWidth / size);
  rows = floor(windowHeight / size);
  createCanvas(cols * size, rows * size);

  initGrid();
  // print(grid);
}

function initGrid() {
  stack = [];
  visited = [];
  finished = false;

  grid = [];
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      // create a new cell at position (i, j)
      grid[i][j] = new Cell(i, j);
      // add neighbors to the cell and the cell to these neighbors
      if (i > 0) {
        grid[i][j].neighbors.push(grid[i - 1][j]);
        grid[i - 1][j].neighbors.push(grid[i][j]);
      }
      if (j > 0) {
        grid[i][j].neighbors.push(grid[i][j - 1]);
        grid[i][j - 1].neighbors.push(grid[i][j]);
      }
    }
  }

  start = grid[0][0];
  generateMaze(true);
}

function draw() {
  background(220);

  showGrid();
  generateMaze();

  if (finished) {
    noLoop();
    showGrid();
    drawStartEnd();
  }
}

function drawStartEnd() {
  push();
  noStroke();
  fill(0, 255, 0);
  circle(0 + size / 2, 0 + size / 2, size / 2);
  fill(255, 0, 0);
  circle((cols - 1) * size + size / 2, (rows - 1) * size + size / 2, size / 2);
  pop();
}

function generateMaze(initial) {
  if (initial) {
    stack.push(start);
  }

  // if the stack is empty, the maze is finished
  if (stack.length === 0) {
    finished = true;
    print("finished");
    return;
  }

  current = stack[stack.length - 1];
  visited.push(current);

  // choose a random neighbor that has not been visited
  let next = random(current.neighbors.filter((neighbor) => !visited.includes(neighbor)));
  if (next) {
    stack.push(next);
    removeWall(current, next);
  } else {
    stack.pop();
  }
}

function removeWall(curr, next) {
  curr.neighbors.splice(curr.neighbors.indexOf(next), 1);
  next.neighbors.splice(next.neighbors.indexOf(curr), 1);
}

function showGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
}
