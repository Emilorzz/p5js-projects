// DIFFICULTIES
// '1' - EASY
// '2' - MEDIUM
// '3' - HARD

// CONTROLS
// RIGHT CLICK   - PLACE FLAG
// LEFT CLICK    - REVEAL CELL
// LEFT CLICK    - REVEAL NEIGHBORS IF FLAGS PLACED
// LEFT CLICK    - RESTART (ON GAME OVER)
// 'R'           - RESTART

// THEMES
// 'L' - LIGHT
// 'D' - DARK

let board;
let mines, cols, rows, size;
let font;
let won, lost;
let bombs;
let banner = 100;
let margin = 20;
let textShown;
let textScale;

let alph = 150;
let increasing = false;

let timer, prevTimer, infoY, time;
let firstClicked;

class Difficulty {
  constructor(mines, cols, rows, size) {
    this.mines = mines;
    this.cols = cols;
    this.rows = rows;
    this.size = size;
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
  easy: new Difficulty(10, 10, 10, 30),
  medium: new Difficulty(40, 16, 16, 30),
  hard: new Difficulty(99, 30, 16, 30),
};

let diff = difficulties.easy;

function preload() {
  font = loadFont("mine-sweeper.ttf");
}

document.addEventListener("touchstart", {});

function setup() {
  lt = new Theme(
    color(200, 200, 220),
    color(160, 160, 180),
    color(210, 210, 230),
    color(100, 100, 120),
    color(50, 50, 70)
  );

  dt = new Theme(color(0, 0, 0), color(10, 10, 10), color(70, 70, 70), color(50, 50, 50), color(150, 150, 150));

  theme = lt;

  infoY = banner - margin / 2;

  mines = diff.mines;
  cols = diff.cols;
  rows = diff.rows;
  size = 21;

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
  noFill();
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

  diff = difficulty;
  mines = diff.mines;
  cols = diff.cols;
  rows = diff.rows;
  size = diff.size;

  board = [];
  bombs = [];
  lost = false;
  won = false;
  increasing = false;
  textShown = false;
  firstClicked = false;

  for (let i = 0; i < cols; i++) {
    board[i] = [];
    for (let j = 0; j < rows; j++) {
      board[i][j] = new Cell(i * size + margin, j * size + banner, size, 0);
    }
  }

  initBombs();
  getValues();

  let w = cols * size + 2 * margin;
  let h = rows * size + banner + margin;
  resizeCanvas(w, h);

  textScale = size * 0.3;
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
  textSize(textScale);
  text("Time:", margin, infoY - 20);
  textSize(textScale * 1.3);
  if (!lost && !won) {
    time = millis();
  }

  text(firstClicked ? nf((time - timer) / 1000, 0, 2) : 0 + " S", margin, infoY);

  pop();
}

function drawHighScore() {
  push();
  textFont(font);
  textAlign(RIGHT);
  fill(theme.text);
  textSize(textScale);
  text("Highscore:", width - margin, infoY - 20);
  textSize(textScale * 1.3);
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
  textAlign(CENTER);
  textSize(textScale);
  text("Mines:", width / 2, infoY - 20);
  textSize(textScale * 1.3);
  text(count, width / 2, infoY);

  pop();
}

function gameState() {
  won = cellsRevealed();

  if (won) {
    let score = (time - timer) / 1000;
    if (score < diff.highscore) {
      diff.highscore = score;
    }

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (board[i][j].isBomb) {
          board[i][j].isFlagged = true;
        }
      }
    }

    showText("YOU\nWON");
    textShown = true;
  } else if (lost) {
    for (cell of bombs) {
      cell.isRevealed = true;
    }

    showText("YOU\nLOST");
    textShown = true;
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
  textSize(40);
  text(s, width / 2, textY);

  if (!increasing && alph <= 0 + 10) {
    increasing = true;
  } else if (increasing && alph >= 255 - 10) {
    increasing = false;
  }

  if (increasing) {
    alph = lerp(alph, 255, 0.05);
  } else {
    alph = lerp(alph, 0, 0.05);
  }
  fill(255, 0, 100, alph);

  textSize(10);
  text("Click or 'R' to play again", width / 2, textY + 75);
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
      if (!lost && !won && !textShown) {
        if (board[i][j].collision()) {
          if (!firstClicked) {
            timer = millis();
            firstClicked = true;
          }

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

  if (textShown) {
    initGame();
  }
}

function keyPressed() {
  if (keyCode == 82) {
    // R
    initGame();
  }
  if (keyCode == 49) {
    // 1
    initGame(difficulties.easy);
  }
  if (keyCode == 50) {
    // 2
    initGame(difficulties.medium);
  }
  if (keyCode == 51) {
    // 3
    initGame(difficulties.hard);
  }
  if (keyCode == 76) {
    // L
    theme = lt;
  }
  if (keyCode == 68) {
    // D
    theme = dt;
  }
}

document.oncontextmenu = function () {
  if (mouseX < width && mouseY < height) return false;
};
