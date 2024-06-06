class Dot {
    constructor() {
        this.x = random(0, width);
        this.s = random(2, 10);
        this.y = random(0, -1000);
        this.c = random(0, 360);
        this.vy = 1;
        this.g = random(0.1, 0.5);
    }

    show() {
        fill(this.c, sat, br);
        circle(this.x, this.y, this.s);
    }

    update() {
        this.y += this.vy;
        this.vy += this.g;
    }
}
