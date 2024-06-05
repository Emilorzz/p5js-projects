let type = {
  EMPTY: 0,
  VISITED: 1,
  WALL: 2,
  PATH: 3,
}

let positions = [
  { function: posRandom, string: "Random" },
  { function: posCorners, string: "Corners" },
];

let textSizes;

let selectedPos = 0;

let algorithms = [dfs, astar];
let selectedAlg = 1;

let size, maxSize, minSize, rows, cols;
let grid;
let coverage = 0.3;

let emptyColor, startColor, endColor, visitedColor, visitedPathColor, wallColor, pathColor;

let start, end, mouseCell;
let path, full, pathaux, fullaux;
let drawRate = 10;
let minPath;

let index, w, r, c, h = 0;

let isPaused, doStep, doHelp, doStats, pathFound, showFull, showPath, doAnimation, doReplay, doDiagonal, doMenu;
let pausedFrame, blinkFps;

function setup() {
  textFont('Courier New');
  textStyle(BOLD)

  doDiagonal = true;
  doAnimation = true;
  showFull = true;
  showPath = true;
  doHelp = false;
  doStats = false;
  doMenu = false;
  isPaused = false;

  pausedFrame = 0;
  blinkFps = 90;
  minSize = 30;
  maxSize = 190;
  size = minSize;

  cols = floor(windowWidth / size);
  rows = floor(windowHeight / size);
  createCanvas(cols * size, rows * size);

  textSizes = [
    constrain(width * 0.03, 0, 30),
    constrain(width * 0.03, 0, 16.3),
    constrain(width * 0.03, 0, 10.7),
  ]

  initGrid();
  setColors();
}

function draw() {
  background(220);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
      if (grid[i][j].collision()) {
        mouseCell = grid[i][j];
      }
    }
  }
  if (!pathFound || path.length < minPath) {
    if (!isPaused || doStep) {
      initGrid();
      doStep = false;
    }
  }
  else {
    showSteps();
  }

  showHelp();
  showStats();
  showMenu();
  showPaused();
}

function noPath() {
  push();

  noStroke();
  fill(200, 0, 50, 200)
  rect(0, height / 2 - 150, width, 300)
  translate(width / 2, height / 2);

  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.075);
  fill(220);
  text("No path found", 0, -25)

  textSize(min(width, height) * 0.025);
  text("press 'G' to generate valid grid", 0, 50)
  text("alternatively, move the start or end cell", 0, 80)

  pop();
}

function showSteps() {
  if (!doAnimation) {
    fullaux = full;
    pathaux = path;
  } else if (doReplay) {
    fullaux = [];
    pathaux = [];
    doReplay = false;
  }
  if (!showFull) {
    fullaux = full;
  }
  if (!showPath) {
    pathaux = path;
  }
  if (full.length > 0 && showFull) {
    drawPath(full, fullaux, visitedPathColor);
  }
  if (path.length > 0 && showPath && (fullaux.length == full.length || !showFull)) {
    drawPath(path, pathaux, pathColor);
  }
}

function showMenu() {
  if (!doHelp && !doStats && !doMenu) {
    push()
    translate(width - 30, 30);

    textAlign(RIGHT, TOP);
    textSize(textSizes[0]);
    fill(255, 245);
    text("M -  Menu", 0, 0)

    pop()
  }
  else if (doMenu) {
    let w = 250;
    push();

    translate(width - w - width * 0.01, width * 0.01);

    noStroke();
    fill(50, 235);
    rect(0, 0, w, h, 5)

    titleElement("MENU", w);

    r = 40;
    c = 40;
    x = 20;
    y = 0;

    textElement(y += 70, "1", "Depth-First\nSearch", null, null, selectedAlg == 0);
    textElement(y += r + 20, "2", "A* Algorithm", null, null, selectedAlg == 1);

    h = y + 70;
    pop();
  }
}

function showStats() {
  if (!doHelp && !doStats && !doMenu) {
    push()
    translate(width - 30, 60);

    textAlign(RIGHT, TOP);
    textSize(textSizes[0]);
    fill(255, 245);
    text("S - STATS", 0, 0)

    pop()
  }
  else if (doStats) {
    let w = 350;
    push();

    translate(width - w - width * 0.01, width * 0.01);

    noStroke();
    fill(50, 235);
    rect(0, 0, w, h, 5)

    titleElement("STATS", w);

    r = 40;
    c = 40;
    x = 120;
    y = 0;

    ctotal = getNumTiles();
    wtotal = getNumWalls();
    cvisited = getNumVisited();
    cpercent = floor(cvisited / ctotal * 10000) / 100;

    textElement(y += 70, "Gridsize", `(${cols}, ${rows})`);
    textElement(y += 20, "Min Path", `${minPath}`);
    textElement(y += 20, "Draw Speed", `${doAnimation ? drawRate / 10 : "inf"} steps/frame`);

    textElement(y += r, "Steps", fullaux.length);
    textElement(y += 20, "Path Length", pathaux.length);
    textElement(y += 20, "Tiles", ctotal);
    textElement(y += 20, "Walls", `${wtotal}, ${coverage * 100}%`);
    textElement(y += 20, "Visited", cvisited);
    textElement(y += 20, "% explored", `${cpercent}%`);

    textElement(y += r, "Start", `(${start.x}, ${start.y})`);
    textElement(y += 20, "End", `(${end.x}, ${end.y})`);

    if (mouseCell != null) {
      textElement(y += r, "Current Cell", `(${mouseCell.x}, ${mouseCell.y})`);
      textElement(y += 20, "Cell Type", mouseCell.type == type.WALL ? "Wall" : "Tile");

      if (selectedAlg = 1) {
        if (mouseCell.hcost != -1) textElement(y += r, "H-Cost", mouseCell.hcost);
        if (mouseCell.gcost != -1) textElement(y += 20, "G-Cost", mouseCell.gcost);
        if (mouseCell.fcost != -1) textElement(y += 20, "F-Cost", mouseCell.fcost);
      }
    }
    h = y + 70;
    pop();
  }
}

function getNumTiles() {
  result = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].type != type.WALL) result++;
    }
  }

  return result;
}

function getNumWalls() {
  result = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].type == type.WALL) result++;
    }
  }

  return result;
}

function getNumVisited() {
  result = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].type == type.VISITED) result++;
    }
  }

  return result;
}

function showPaused() {
  if (isPaused) {
    push()
    translate(width / 2, height - 30);

    textAlign(CENTER, BOTTOM);
    textSize(width * 0.05)
    alpha = pausedFrame % blinkFps;
    pausedFrame++;

    if (alpha < blinkFps / 2) {
      fill(255, map(alpha, 0, blinkFps / 2, -45, 300));
    } else {
      fill(255, map(alpha, blinkFps / 2, blinkFps, 300, -45));
    }
    text("paused", 0, 0)

    pop()
  }
}

function showHelp() {
  if (!doHelp && !doStats && !doMenu) {
    push()
    translate(width - 30, 90);

    textAlign(RIGHT, TOP);
    textSize(textSizes[0]);
    fill(255, 245);
    text("H -  HELP", 0, 0)

    pop()
  }
  else if (doHelp) {
    let w = 600;
    push()

    translate(width - w - width * 0.01, width * 0.01);

    noStroke();
    fill(50, 235);
    rect(0, 0, w, h, 5)

    titleElement("HELP", w);

    r = 40;
    c = 40;
    x = 145;
    y = 0;

    textElement(y += 70, "LEFT CLICK", "Place start cell", "Place on end cell to swap start\nand end");
    textElement(y += r + 30, "RIGHT CLICK", "Place end cell");
    textElement(y += 20, "+ SHIFT", "Place / Remove wall");
    textElement(y += r, "P", "Start / End placement", null, positions[selectedPos].string);
    textElement(y += r, "UP", "Increase Draw Speed", null, `${drawRate / 10}`);
    textElement(y += 20, "DOWN", "Decrease Draw Speed");
    textElement(y += r, "SPACEBAR", "Toggle pause search", null, isPaused);
    textElement(y += 20, "N", "Step through search");
    textElement(y += r, "G", "Generate new grid");
    textElement(y += r, "0 - 8", "0% - 80% wall coverage", null, `${coverage * 100}%`);
    textElement(y += r, "SHIFT + SCROLL", "Change cell size", null, `${map(size, minSize, maxSize, 1, (maxSize - minSize) / 5 + 1)}`);
    textElement(y += r, "D", "Toggle diagonal path", null, doDiagonal);
    textElement(y += r, "Z", "Toggle show full path", null, showFull);
    textElement(y += r, "X", "Toggle show short path", null, showPath);
    textElement(y += r, "A", "Toggle animate path", null, doAnimation);
    textElement(y += 20, "R", "Replay animation");

    h = y + 70;
    pop()
  }
}

function titleElement(string, w) {
  fill(200);
  translate(20, 20);
  textAlign(LEFT, TOP)
  textSize(textSizes[0]);
  text(string, 0, 0)

  strokeWeight(5);
  stroke(200)
  line(0, 40, w - 40, 40)
  noStroke();
}

function textElement(y, first, second = null, subtext = null, third = null, bool = null) {
  push();

  textSize(textSizes[1]);

  textAlign(RIGHT);
  text(first, x, y);

  if (second != null) {
    textAlign(LEFT);
    push();

    if (bool) {
      textSize(textSizes[1] * 1.1);
      fill(bool ? color(0, 200, 50) : color(200));
    }
    text(second, x + c, y);

    pop();
  }

  if (subtext != null) {
    push();

    textSize(textSizes[2]);
    fill(120);
    text(subtext, x + c, y + 20);

    pop();
  }

  if (third != null) {
    textAlign(CENTER);
    if (typeof (third) == "boolean") {
      fill(third ? color(0, 200, 50) : color(200, 0, 50));
      text(third ? "ENABLED" : "DISABLED", x + c * 8.5, y);
    }
    else if (typeof (third) == "string") {
      text(third, x + c * 8.5, y);
    }
  }

  pop();
}

function setColors() {
  emptyColor = color(100);
  startColor = color(0, 200, 50);
  endColor = color(200, 0, 50);
  visitedColor = color(0, 200, 200);
  visitedPathColor = color(255, 0, 150);
  wallColor = color(20);
  pathColor = color(255, 255, 0);
}

function drawPath(arr, aux, color) {
  push();

  if (aux.length == 0) {
    index = 0;
  }

  strokeWeight(0.2 * size);
  stroke(color);

  if (aux.length < arr.length) {
    if (!isPaused || doStep) {
      let newIndex = index + drawRate / 10;
      for (let i = floor(index); i < newIndex && i < arr.length; i++) {
        aux[i] = arr[i];
      }
      index = newIndex;
    }
  }

  for (pair of aux) {
    line(pair[0].x * size + size / 2, pair[0].y * size + size / 2, pair[1].x * size + size / 2, pair[1].y * size + size / 2)
  }

  pop();
}

function initGrid() {
  // do {
  index = 0;
  path = [];
  full = [];
  pathaux = [];
  fullaux = [];
  setColors();
  minPath = floor((cols + rows) / 8);

  pathFound = false;
  grid = [];
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }

  positions[selectedPos].function();
  initWalls();
  initNeighbors();
  // algorithms[selected](start);
  // } while (!algorithms[selectedAlg](start) || path.length < 20);
  algorithms[selectedAlg](start);
}

function posRandom() {
  start = grid[floor(random(cols - 1))][floor(random(rows - 1))];
  end = grid[floor(random(cols - 1))][floor(random(rows - 1))];
}

function posCorners() {
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
}

function resetCells() {
  index = 0;
  setColors();
  path = [];
  full = [];
  pathaux = [];
  fullaux = [];
  pathFound = false;

  initNeighbors();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].type == type.VISITED) {
        grid[i][j].type = type.EMPTY;
      }
    }
  }

}

function initWalls() {
  let i = 0;
  while (i < floor((cols * rows) * coverage)) {
    let x = int(random(cols));
    let y = int(random(rows));

    if (grid[x][y] !== start && grid[x][y] !== end)
      if (grid[x][y].type != type.WALL) {
        grid[x][y].type = type.WALL;
        i++;
      }
  }
}

function initNeighbors() {
  let directions;
  if (doDiagonal) {
    directions = [
      { dx: 1, dy: -1 },  // diagonal up-right
      { dx: 0, dy: -1 },  // up
      { dx: -1, dy: 0 },  // left
      { dx: -1, dy: -1 }, // diagonal up-left
      { dx: -1, dy: 1 },  // diagonal down-left
      { dx: 0, dy: 1 },   // down
      { dx: 1, dy: 0 },   // right
      { dx: 1, dy: 1 },   // diagonal down-right
    ];
  }
  else {
    directions = [
      { dx: 0, dy: -1 },  // up
      { dx: -1, dy: 0 },  // left
      { dx: 0, dy: 1 },   // down
      { dx: 1, dy: 0 },   // right
    ];
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].neighbors = [];

      if (grid[i][j].type != type.WALL) {
        for (let dir of directions) {
          let nx = i + dir.dx;
          let ny = j + dir.dy;

          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows &&
            grid[nx][ny].type != type.WALL) {
            grid[i][j].neighbors.push(grid[nx][ny]);
          }
        }
      }
    }
  }
}

function dfs(start) {
  let stack = [start];
  start.type = type.VISITED;
  let parents = new Map();  // why are dictionaries called maps

  while (stack.length > 0) {
    let cell = stack.pop();

    if (pathFound) break;

    for (let neighbor of cell.neighbors) {
      if (neighbor.type != type.VISITED) {
        neighbor.type = type.VISITED;

        stack.push(neighbor);
        parents.set(neighbor, cell);
        full.push([cell, neighbor]);

        if (neighbor === end) {
          pathFound = true;
          break;
        }
      }
    }
  }

  if (pathFound) {
    let current = end;
    while (current !== start) {
      let parent = parents.get(current);
      path.push([parent, current]);
      current = parent;
    }

    path.reverse();

    return true;
  }
  else {
    visitedColor = color(150)
    return false;
  }
}

// recursive
// function dfs(cell) {
//   if (found) return;

//   if (cell === end) {
//     found = true;
//     return;
//   }

//   cell.type = type.VISITED;

//   for (let neighbor of cell.neighbors) {
//     if (neighbor.type != type.VISITED && !found) {
//       path.push([cell, neighbor])
//       dfs(neighbor);
//     }
//   }

//   if (!found && cell === start) {
//     visitedColor = color(150);
//   }
// }

function astar(start) {
  let open = [start];
  let closed = new Set();
  let parents = new Map();

  start.type = type.VISITED;
  start.gcost = 0;
  start.hcost = start.distToEnd() * 10;
  start.fcost = start.hcost;

  while (open.length > 0) {
    open.sort((a, b) => a.fcost - b.fcost);
    let cell = open.shift();

    closed.add(cell);

    if (cell === end) {
      pathFound = true;
      break;
    }

    for (let neighbor of cell.neighbors) {
      if (closed.has(neighbor)) continue;


      let g = cell.gcost + ((abs(cell.x - neighbor.x) > 0 && abs(cell.y - neighbor.y)) ? 14 : 10);

      if (!open.includes(neighbor) || g < neighbor.gcost) {
        neighbor.gcost = g;
        neighbor.hcost = neighbor.distToEnd() * 10;
        neighbor.fcost = neighbor.gcost + neighbor.hcost;

        parents.set(neighbor, cell);

        if (!open.includes(neighbor)) {
          open.push(neighbor);
        }

        neighbor.type = type.VISITED;
        full.push([cell, neighbor]);
      }
    }
  }

  if (pathFound) {
    let current = end;
    while (current !== start) {
      let parent = parents.get(current);
      path.push([parent, current]);
      current = parent;
    }

    path.reverse();

    return true;
  }
  else {
    visitedColor = color(150)
    return false;
  }
}

function mousePressed() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].collision()) {
        mouseCell = grid[i][j]
        if (mouseButton == LEFT) {
          if (keyIsDown(SHIFT)) {
            print(grid[i][j])
            print(grid[i][j].neighbors)
          }
          else {
            if (grid[i][j].type != type.WALL) {
              if (grid[i][j] !== start) {
                if (grid[i][j] === end) {
                  end = start;
                  start = grid[i][j];
                }
                start = grid[i][j];
                resetCells();
                algorithms[selectedAlg](start);
              }
            }
          }
        }
        if (mouseButton == RIGHT) {
          if (keyIsDown(SHIFT)) {
            if (grid[i][j] !== start && grid[i][j] !== end) {
              grid[i][j].type = grid[i][j].type == type.WALL ? type.EMPTY : type.WALL;
              resetCells();
              algorithms[selectedAlg](start);
            }
          }
          else {
            if (grid[i][j].type != type.WALL) {
              if (grid[i][j] !== end) {
                if (grid[i][j] === start) {
                  start = end;
                  end = grid[i][j];
                }
                end = grid[i][j];
                resetCells();
                algorithms[selectedAlg](start);
              }
            }
          }
        }
      }
    }
  }
}

function keyPressed() {
  switch (keyCode) {
    case 71: // G
      initGrid();
      break;
    case 32:  // SPACEBAR
      isPaused = !isPaused;
      pausedFrame = blinkFps * 0.5;
      break;
    case 78: // N
      doStep = true;
      break;
    case 72: // H
      doHelp = !doHelp;
      doStats = false;
      doMenu = false;
      break;
    case 83: // S
      doStats = !doStats;
      doHelp = false;
      doMenu = false;
      break;
    case 77: // M
      doMenu = !doMenu;
      doStats = false;
      doHelp = false;
      break;
    case 80: // P
      selectedPos = (selectedPos + 1) % positions.length;
      initGrid();
      break;
    case 88: // X
      showPath = !showPath;
      break;
    case 90: // Z
      showFull = !showFull;
      break;
    case 65: // A
      doAnimation = !doAnimation;
      break;
    case 82: // R
      doReplay = true;
      doAnimation = true;
      break;
    case 68: // D
      doDiagonal = !doDiagonal;
      resetCells();
      algorithms[selectedAlg](start);
      break;
    case 48:
      coverage = 0;
      initGrid();
      break;
    case 49:
      if (doMenu) {
        selectedAlg = 0;
        resetCells();
        algorithms[selectedAlg](start);
      } else {
        coverage = 0.1;
        initGrid();
      }
      break;
    case 50:
      if (doMenu) {
        selectedAlg = 1;
        resetCells();
        algorithms[selectedAlg](start);
      } else {
        coverage = 0.2;
        initGrid();
      }
      break;
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
      coverage = (keyCode - 48) * 0.1;
      initGrid();
      break;
    case 38: // up
    case 40: // down
      if (drawRate < 10) drawRate += (keyCode == 38 ? 1 : -1);
      else if (drawRate == 10) drawRate += (keyCode == 38 ? 10 : -1);
      else if (drawRate > 10) drawRate += (keyCode == 38 ? 10 : -10);

      drawRate = constrain(drawRate, 1, 100);
      break;
  }
}

function mouseWheel(event) {
  if (keyIsDown(SHIFT)) {
    let dsize = size;
    if (event.delta > 0) {
      dsize -= 5;
    } else {
      dsize += 5;
    }
    dsize = constrain(dsize, minSize, maxSize);

    if (dsize != size) {
      size = dsize;

      cols = floor(windowWidth / size);
      rows = floor(windowHeight / size);
      initGrid();
      print(size);
      resizeCanvas(cols * size, rows * size);
    }
  }
}

document.oncontextmenu = function () {
  if (mouseX < width && mouseY < height)
    return false;
}