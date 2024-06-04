class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = type.EMPTY;
        this.neighbors = [];
        this.gcost = -1;
        this.hcost = -1;
        this.fcost = -1;
    }

    show() {
        push()

        strokeWeight(0.05 * size);
        stroke(wallColor);

        let color;

        if (this === start) {
            color = startColor;
        }
        else if (this === end) {
            color = endColor;
        }
        else {
            switch (this.type) {
                case type.VISITED:
                // color = visitedColor;
                // break;
                case type.EMPTY:
                    color = emptyColor;
                    break;
                case type.WALL:
                    color = wallColor;
                    break;
                case type.PATH:
                    color = pathColor;
                    break;
            }
        }

        fill(color);

        rect(this.x * size, this.y * size, size);

        pop()
    }

    collision() {
        if (mouseX > this.x * size
            && mouseX < this.x * size + size
            && mouseY > this.y * size
            && mouseY < this.y * size + size) {
            return true;
        }

        return false;
    }

    distToEnd() {
        return abs(this.x - end.x) + abs(this.y - end.y);
    }
}