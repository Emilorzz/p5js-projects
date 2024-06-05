class Cell {
  constructor(x, y, s, isBomb) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.isBomb = isBomb;
    this.isRevealed = false;
    this.isFlagged = false;
    this.value = 0;

    this.neighbors = [];
  }

  show() {
    push();
    strokeWeight(3);
    stroke(theme.strk);

    if (!this.isRevealed) {
      if (this.isFlagged) {
        this.showFlag();
      } else if (this.isBomb && lost) {
        this.showBomb();
      } else {
        this.showDefault();
      }
    } else {
      if (this.isBomb) {
        this.showBomb();
      } else {
        this.showRevealed();
        if (this.value == 0) {
          this.discover();
        }
      }
    }
    pop();

  }

  showDefault() {
    fill(theme.unrev);
    rect(this.x, this.y, this.s);
  }

  showFlag() {
    push();

    fill(theme.unrev);
    rect(this.x, this.y, this.s);

    strokeCap(SQUARE);
    strokeWeight(3);
    stroke(theme.text);
    let poleX = this.x + this.s / 2;
    let flagSize = 10;
    let cellMargin = 6;
    let footY = this.y + size - cellMargin * 1.5;
    line(poleX, this.y + cellMargin, poleX, footY);

    fill(0);
    ellipse(poleX, footY, 5, 1.5);

    strokeWeight(0);
    fill(255, 0, 0);
    triangle(
      poleX - 1, this.y + cellMargin,
      poleX - 1, this.y + cellMargin + flagSize,
      poleX - flagSize * 0.75, this.y + cellMargin + flagSize / 2
    )

    pop();
  }

  showBomb() {
    push();

    fill(theme.rev);
    rect(this.x, this.y, this.s);
    fill(theme.text);
    noStroke();
    circle(this.x + this.s / 2, this.y + this.s / 2, this.s / 2);

    stroke(theme.text);
    strokeWeight(4);
    strokeCap(PROJECT);

    angleMode(DEGREES);
    let pinX = this.x + this.s / 2;
    let pinY = this.y + this.s / 2;
    let pinLength = 7;
    let pins = 8;

    translate(pinX, pinY);
    for (let i = 0; i < pins; i++) {
      rotate(360 / pins);
      line(0, 0, 0, pinLength);
    }

    pop();
  }

  showRevealed() {
    push();

    fill(theme.rev);
    rect(this.x, this.y, this.s);

    if (this.value > 0) {

      colorMode(HSB);
      noStroke();
      textFont(font);
      textSize(15);
      textAlign(CENTER, CENTER)
      fill(map(this.value, 1, 8, 255, 0), 75, 100);
      text(this.value, this.x + this.s / 2, this.y + this.s / 2);
    }

    pop();
  }

  collision() {
    if (mouseX > this.x
      && mouseX < this.x + this.s
      && mouseY > this.y
      && mouseY < this.y + this.s) {
      return true;
    }

    return false;
  }

  discover() {
    for (let cell of this.neighbors) {
      if (!cell.isRevealed && !cell.isBomb) {
        cell.isRevealed = true;
        if (cell.value == 0) {
          cell.discover();
        }
      }
    }
  }

  revealNeighbors() {
    let count = 0;

    for (let cell of this.neighbors) {
      if (cell.isFlagged) {
        count++;
      }
    }

    if (count == this.value) {
      for (let cell of this.neighbors) {
        if (!cell.isRevealed && !cell.isFlagged) {
          if (cell.isBomb) {
            lost = true;
          }

          cell.isRevealed = true;
        }
      }
    }
  }
}