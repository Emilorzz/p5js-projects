class Snake {
  constructor(dir) {
    this.head = new Node(0, 0);
    this.tail = this.head;
    this.dir = dir;
    this.s = 20;
    this.l = 2;
    this.alive = true;
  }

  update() {
    if (!this.alive) return;

    changed = false;

    let newX = (this.head.x + this.dir.x * this.s + width) % width;
    let newY = (this.head.y + this.dir.y * this.s + height) % height;

    let curr = this.head;
    while (curr) {
      if (curr.x === newX && curr.y === newY) {
        this.alive = false;
        started = false;
        blinkTimer = 0;
        return;
      }

      curr = curr.next;
    }

    let newHead = new Node(newX, newY);
    newHead.next = this.head;
    this.head = newHead;

    if (this.l < this.getLength()) {
      this.removeTail();
    }
  }

  getLength() {
    let count = 0;
    let curr = this.head;

    while (curr) {
      count++;
      curr = curr.next;
    }

    return count;
  }

  removeTail() {
    let curr = this.head;

    while (curr.next && curr.next.next) {
      curr = curr.next;
    }

    curr.next = null;
  }

  collision() {
    let curr = this.head.next;

    while (curr.next) {
      if (this.head.x == curr.x && this.head.y == curr.y) {
        this.alive = false;
        initGame();
      }
    }
  }

  show() {
    stroke(currTheme.snake);
    strokeCap(PROJECT);
    strokeWeight(this.s * 0.75);
    noFill();

    let curr = this.head;
    while (curr && curr.next) {
      if (dist(curr.x, curr.y, curr.next.x, curr.next.y) < this.s * 2) {
        line(curr.x + this.s / 2, curr.y + this.s / 2, curr.next.x + this.s / 2, curr.next.y + this.s / 2);
      }

      curr = curr.next;
    }
  }
}
