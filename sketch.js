const gridItems = [];
let img;

function preload() {
    image = loadImage('logo.png');
}

function setup() {
	createCanvas(600, 600);
    background(51);
    const gridItemLength = width / 4;
    
    // Array.fill werkt niet op IE
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            gridItems.push(new GridItem(gridItemLength * i, gridItemLength * j, i, j, gridItemLength));
        }
    }
}

function draw() {
    for(const item of gridItems) {
        item.show();
    }
}
