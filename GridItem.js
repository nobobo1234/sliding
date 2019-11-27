class GridItem {
    constructor(x, y, i, j, length) {
        this.canvasX = x;
        this.canvasY = y;
        this.i = i;
        this.j = j;
        this.length = length;
    }

    show() {
        push();
        fill(255);
        stroke(0);
        strokeWeight(0.3);
        rect(this.canvasX+1, this.canvasY+1, this.length-2, this.length-2);
        pop();
    }
}
