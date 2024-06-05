// DIFFICULTIES
// '1' - EASY
// '2' - MEDIUM
// '3' - HARD

// CONTROLS
// LEFT CLICK   - REVEAL CELL / REVEAL NEIGHBORS IF FLAGS PLACED
// RIGHT CLICK  - PLACE FLAG
// 'R' - RESET

// THEMES
// 'L' - LIGHT
// 'D' - DARK

let board;
let mines, cols, rows, size;
let font;
let lost;
let bombs;
let banner = 100;
let margin = 20;
let textShown;

let alph = 150;
let increasing = false;

let timer, prevTimer, infoY;

class Difficulty {
  constructor(mines, cols, rows) {
    this.mines = mines;
    this.cols = cols;
    this.rows = rows;
    this.highscore = Infinity;
  }
}

class Theme {
  constructor(bg, unrev, rev, strk, text) {
    this.bg = bg;
    this.unrev = unrev;
    this.rev = rev;
    this.strk = strk;
    this.text = text;
  }
}

let lt, dt, theme;

let difficulties = {
  easy: new Difficulty(10, 10, 10),
  medium: new Difficulty(40, 16, 16),
  hard: new Difficulty(99, 30, 16)
}

let diff = difficulties.easy;

function preload() {
  font = loadFont("mine-sweeper.ttf");
}

function setup() {
  lt = new Theme(
    color(200, 200, 220),
    color(160, 160, 180),
    color(210, 210, 230),
    color(100, 100, 120),
    color(50, 50, 70),
  )

  dt = new Theme(
    color(0, 0, 0),
    color(10, 10, 10),
    color(70, 70, 70),
    color(50, 50, 50),
    color(150, 150, 150)
  )

  theme = lt;

  infoY = banner - margin / 2;

  mines = diff.mines;
  cols = diff.cols;
  rows = diff.rows;
  size = 30;
  createCanvas(cols * size + 2 * margin, rows * size + banner + margin);

  initGame();
}

function draw() {
  background(theme.bg);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j].show();
    }
  }

  push();
  noFill()
  stroke(theme.strk);
  strokeWeight(5);
  rect(margin, banner, width - 2 * margin, height - margin - banner);
  pop();

  drawTimer();
  drawHighScore();
  drawMinesLeft();
  gameState();
}

function initGame(difficulty = diff) {
  prevTimer = timer;
  timer = millis();

  diff = difficulty;
  mines = diff.mines;
  cols = diff.cols;
  rows = diff.rows;

  board = [];
  bombs = [];
  lost = false;
  increasing = false;

  for (let i = 0; i < cols; i++) {
    board[i] = [];
    for (let j = 0; j < rows; j++) {
      board[i][j] = new Cell(i * size + margin, j * size + banner, size, 0);
    }
  }

  initBombs();
  getValues();
  resizeCanvas(cols * size + 2 * margin, rows * size + banner + margin);
}

function initBombs() {
  let i = 0;
  while (i < mines) {
    let x = int(random(cols));
    let y = int(random(rows));

    if (!board[x][y].isBomb) {
      board[x][y].isBomb = true;
      bombs.push(board[x][y]);
      i++;
    }
  }
}

function getValues() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let neighbors = [];
      if (i - 1 >= 0) {
        neighbors.push(board[i - 1][j]);
        if (j - 1 >= 0) {
          neighbors.push(board[i - 1][j - 1]);
        }
        if (j + 1 < rows) {
          neighbors.push(board[i - 1][j + 1]);
        }
      }
      if (i + 1 < cols) {
        neighbors.push(board[i + 1][j]);
        if (j - 1 >= 0) {
          neighbors.push(board[i + 1][j - 1]);
        }
        if (j + 1 < rows) {
          neighbors.push(board[i + 1][j + 1]);
        }
      }
      if (j - 1 >= 0) {
        neighbors.push(board[i][j - 1]);
      }
      if (j + 1 < rows) {
        neighbors.push(board[i][j + 1]);
      }

      for (cell of neighbors) {
        if (cell.isBomb) {
          board[i][j].value++;
        }
      }

      board[i][j].neighbors = neighbors;
    }
  }
}

function drawTimer() {
  push();
  textFont(font);
  fill(theme.text);
  textSize(8);
  text("Time:", margin, infoY - 20);
  textSize(12);
  text(nf((millis() - timer) / 1000, 0, 2) + " S", margin, infoY);

  pop();
}

function drawHighScore() {
  push();
  textFont(font);
  textAlign(RIGHT)
  fill(theme.text);
  textSize(8);
  text("Highscore:", width - margin, infoY - 20);
  textSize(12);
  text(diff.highscore === Infinity ? "inf" : nf(diff.highscore, 0, 2) + " S", width - margin, infoY);

  pop();
}

function drawMinesLeft() {
  let count = diff.mines;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j].isFlagged) {
        count--;
      }
    }
  }

  push();

  textFont(font);
  fill(theme.text);
  textSize(8);
  text("Mines:", width / 2 - size, infoY - 20);
  textSize(12);
  text(count, width / 2 - size, infoY);

  pop();
}

function gameState() {
  if (cellsRevealed()) {
    let endTime = millis();
    let score = (endTime - timer) / 1000;
    if (score < diff.highscore) {
      diff.highscore = score;
    }
    showText("YOU\nWON");
  } else if (lost) {
    for (cell of bombs) {
      cell.isRevealed = true;
    }

    showText("YOU\nLOST");
  }
}

function showText(s) {
  push();
  noStroke();
  fill(0, 200);
  rect(-10, -10, width + 2 * margin, height + banner + margin);
  textFont(font);
  fill(255);
  textAlign(CENTER, CENTER);

  let textY = height / 2;
  textSize(40)
  text(s, width / 2, textY);

  if (!increasing && alph <= 0 + 10) {  // Using a proximity threshold
    increasing = true;
  } else if (increasing && alph >= 255 - 10) {
    increasing = false;
  }

  if (increasing) {
    alph = lerp(alph, 255, 0.05);  // Increase alpha towards 255
  } else {
    alph = lerp(alph, 0, 0.05);  // Decrease alpha towards 0
  }
  fill(255, 0, 100, alph);

  textSize(10);
  text("press 'R' to play again", width / 2, textY + 75);
  pop();
}

function bombsFlagged() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j].isBomb) {
        if (!board[i][j].isFlagged) {
          return false;
        }
      }
    }
  }

  return true;
}

function revealAll() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!board[i][j].isBomb) {
        board[i][j].isRevealed = true;
      }
    }
  }
}

function cellsRevealed() {

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!board[i][j].isBomb) {
        if (!board[i][j].isRevealed) {
          return false;
        }
      }
    }
  }
  return true;
}

function mousePressed() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!lost) {
        if (board[i][j].collision()) {
          if (mouseButton == LEFT && !board[i][j].isRevealed) {
            if (board[i][j].isBomb) {
              lost = true;
            }
            board[i][j].isRevealed = true;
          } else if (mouseButton == LEFT && board[i][j].isRevealed) {
            board[i][j].revealNeighbors();

          } else if (mouseButton == RIGHT && !board[i][j].isRevealed) {
            board[i][j].isFlagged = !board[i][j].isFlagged;
          }
        }
      }
    }
  }
}

function keyPressed() {
  if (keyCode == 82) { // R
    initGame();
  }
  if (keyCode == 49) { // 1
    initGame(difficulties.easy);
  }
  if (keyCode == 50) { // 2
    initGame(difficulties.medium);
  }
  if (keyCode == 51) { // 3
    initGame(difficulties.hard);
  }
  if (keyCode == 76) { // L
    theme = lt;
  }
  if (keyCode == 68) { // D
    theme = dt;
  }
}

document.oncontextmenu = function () {
  if (mouseX < width && mouseY < height)
    return false;
}