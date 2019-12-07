class GridItem {
    constructor(i, j, length, img, isEmpty) {
        this.i = i;
        this.j = j;
        this.length = length;
        this.img = img;
        this.index = 4 * i + j;
        this.isEmpty = isEmpty;
    }

    show() {
        push();
        fill(255);
        stroke(0);
        strokeWeight(0.3);
        rect(
            this.i * this.length + 1,
            this.j * this.length + 1,
            this.length - 2,
            this.length - 2
        );
        if (!this.isEmpty) {
            image(this.img, this.i * this.length + 1, this.j * this.length + 1);
        }
        pop();
    }

    setCoords(i, j) {
        this.i = i;
        this.j = j;
    }
}
