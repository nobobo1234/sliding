const gridItems = [];
let img;
const dimension = 4;
const imageParts = [];

function preload() {
    img = loadImage('logo.png');
}

function setup() {
    img.loadPixels();
    const canvas = createCanvas(img.width, img.height);
    const container = document.querySelector('.container');
    canvas.parent(container);
    const gridItemLength = width / 4;

    // Array.fill werkt niet op IE
    for (let i = 0; i < dimension; i++) {
        gridItems.push([]);
        for (let j = 0; j < dimension; j++) {
            const canvasX = gridItemLength * i;
            const canvasY = gridItemLength * j;
            const imageLength = gridItemLength - 2; // Account for the stroke that needs to be added
            let part = "";
            let isEmpty = true;

            if (i !== dimension - 1 || j !== dimension - 1) {
                part = createImage(imageLength, imageLength);
                part.loadPixels();
                for (let x = canvasX; x < canvasX + imageLength; x++) {
                    for (let y = canvasY; y < canvasY + imageLength; y++) {
                        let index = (x + y * img.width) * 4;
                        let partIndex = (x - canvasX + (y - canvasY) * part.width) * 4; 
                        part.pixels[partIndex] = img.pixels[index];
                        part.pixels[partIndex + 1] = img.pixels[index + 1];
                        part.pixels[partIndex + 2] = img.pixels[index + 2];
                        part.pixels[partIndex + 3] = img.pixels[index + 3];
                    }
                }
                part.updatePixels();
                isEmpty = false;
                imageParts.push(part);
            }

            gridItems[i].push(new GridItem(i, j, gridItemLength, part, isEmpty));
        }
    }
}

function draw() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            gridItems[i][j].show();
        }
    }
}

function checkIfWon() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            const gridItem = gridItems[i][j];
            if (gridItem.i !== gridItem.actualI || gridItem.j !== gridItem.actualJ) {
                return false
            }
        }
    }
    return true;
}

function mousePressed() {
    const i = floor(map(mouseX, 0, width, 0, dimension));
    const j = floor(map(mouseY, 0, height, 0, dimension));
    for (let deltaI = -1; deltaI <= 1; deltaI++) {
        for (let deltaJ = -1; deltaJ <= 1; deltaJ++) {
            // All the one's on the edges have at least one zero so have a sum of -1 or 1
            if (deltaI + deltaJ === 0 || deltaI + deltaJ === 2 || deltaI + deltaJ == -2) continue;
            const absoluteI = i + deltaI;
            const absoluteJ = j + deltaJ;
            if (absoluteI >= 0 && absoluteI < dimension && absoluteJ >= 0 && absoluteJ < dimension) {
                if (gridItems[absoluteI][absoluteJ].isEmpty) {
                    const newImg = gridItems[i][j].img;
                    gridItems[absoluteI][absoluteJ].setImg(newImg);
                    gridItems[i][j].setImg("");
                }
            }
        }
    }
}

function shuffleImages() {
    const availableIndeces = shuffle(Array.from({ length: imageParts.length }, (_, i) => i));
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if(i === 3 && j === 3) continue;
            gridItems[i][j].img = imageParts[availableIndeces.shift()]
        }
    }
}
