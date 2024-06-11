let dirs;
let started, changed = false;
let font;

let highscore = 0;

let snake, fruit;

function preload() {
  font = loadFont("bit5x3.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(20);

    dirs = {
      RIGHT : createVector(1,0),
      DOWN  : createVector(0,1),
      LEFT  : createVector(-1,0),
      UP    : createVector(0,-1),
    }

    initGame();
    }

function draw() {
  resizeCanvas(floor(windowWidth / snake.s) * snake.s, floor(windowHeight / snake.s) * snake.s);

  background(220);
  
  snake.show();

  if (started) {
    snake.update();
    drawFruit();
    updateScore();
    } else {
      drawText();
      }
      
  if (highscore > 0) {
    drawScore();
  }
}

function updateScore() {
  if(snake.l > highscore) {
    highscore = snake.l;
  }
}

function drawScore() {
  push();

  fill(0);
  noStroke();
  textFont(font);
  textSize(20);
  translate(width/2, 50);
  
  textAlign(LEFT);
  text(`Length: ${snake.l}`, -150, 0);
  textAlign(RIGHT);
  text(`Highscore: ${highscore}`, 150, 0);

  pop();
}

function drawText() {
  push();

  textFont(font);

  noStroke();
  fill(0);
  textAlign(CENTER,CENTER);
  
  translate(width / 2, height / 2);
  
  if (frameCount % 20 < 10) {
    textSize(60);
  text(snake.alive ? "Start Game" : "Game Over", 0, -25);
textSize(20);
text("Use WASD or ARROW KEYS to move", 0, 25);
}

  pop();
}

function drawFruit() {
  push();

  rectMode(RADIUS)
  // noStroke();
  // fill(0);
  // rect(fruit.x + snake.s / 2,fruit.y  + snake.s / 2, snake.s / 2);
  stroke(255, 0, 50);
  point(fruit.x + snake.s / 2,fruit.y  + snake.s / 2);

  if (dist(snake.head.x, snake.head.y, fruit.x, fruit.y) < snake.s) {
    snake.l++;
    newFruit();
  }
  
  pop();
}

function initGame(dir = dirs.RIGHT) {
  snake = new Snake(dir);
  newFruit();
}

function newFruit() {
  fruit = {
    x : (floor(random(width) / snake.s) * snake.s),
    y : (floor(random(height) / snake.s) * snake.s),
  }
}

function keyPressed() {
  if (!started) {
    started = true;
    initGame();
  }

  switch (keyCode) {
    case 87:  // w
    case 38:  // up
      if (snake.dir != dirs.DOWN && !changed) {
        snake.dir = dirs.UP;
        changed = true;
      } 
      break;
    case 68:  // d
    case 39:  // right
      if (snake.dir != dirs.LEFT && !changed) {
        snake.dir = dirs.RIGHT;
        changed = true;
      } 
      break;
    case 83:  // s
    case 40:  // down
      if (snake.dir != dirs.UP && !changed) {
        snake.dir = dirs.DOWN;
        changed = true;
      } 
      break;
    case 65:  // a
    case 37:  // left
      if (snake.dir != dirs.RIGHT && !changed) {
        snake.dir = dirs.LEFT;
        changed = true;
      } 
      break;
  }
}

function mouseWheel(event) {
  if (event.delta > 0) {
    snake.s -= 5;
  } else {
    snake.s += 5;
  }
}

function windowResized() {
  resizeCanvas(floor(windowWidth / snake.s) * snake.s, floor(windowHeight / snake.s) * snake.s);
  newFruit();

}