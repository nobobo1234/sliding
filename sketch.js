const gridItems = [];
let seconds = 0;
let gameIsGoing = false;
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

    if(gameIsGoing) {
        const won = checkIfWon();
        if (won) {
            const button = document.querySelector('.button');
            button.removeAttribute('disabled');
            gameIsGoing = false;
        }
    }
}

function checkIfWon() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            const gridItem = gridItems[i][j];
            if (gridItem.i !== i || gridItem.j !== j) {
                return false
            }
        }
    }
    return true;
}

function findGridItem(i, j) {
    const flatGridItems = gridItems.reduce((prev, curr) => prev.concat(curr));
    return flatGridItems.find(e => e.i === i && e.j === j);
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
                const neighbourItem = findGridItem(absoluteI, absoluteJ);
                if (neighbourItem.isEmpty) {
                    moves++;
                    gameIsGoing = true;
                    const centerItem = findGridItem(i, j);
                    neighbourItem.setCoords(i, j);
                    centerItem.setCoords(absoluteI, absoluteJ);
                }
            }
        }
    }
}

function shuffleImages() {
    const possiblePoints = [];
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if(gridItems[i][j].isEmpty) continue;
            possiblePoints.push([i, j]);
        }
    }
    const points = shuffle(possiblePoints);
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (gridItems[i][j].isEmpty) continue;
            const newCoords = points.shift();
            gridItems[i][j].setCoords(newCoords[0], newCoords[1]);
            gridItems[i][j].index = newCoords[1] * dimension + newCoords[0];
        }
    }

    const button = document.querySelector('.button');
    button.setAttribute('disabled', true)
}
