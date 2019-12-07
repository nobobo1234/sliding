let gridItems = [];
let moves = 0;
let gameIsGoing = false;
let img;
const dimension = 4;
const imageParts = [];
let shuffled = false;
const modalClick = event =>
    event.target.className === 'modal-background'
        ? event.target.setAttribute('hidden', true)
        : null;

function preload() {
    img = loadImage('logo.png');
}

function setup() {
    img.loadPixels();
    const canvas = createCanvas(img.width, img.height);
    const container = document.querySelector('.container');
    canvas.parent(container);
    const gridItemLength = width / 4;

    // Creating 2d array with GridItems
    for (let i = 0; i < dimension; i++) {
        gridItems.push([]);
        for (let j = 0; j < dimension; j++) {
            const canvasX = gridItemLength * i;
            const canvasY = gridItemLength * j;
            const imageLength = gridItemLength - 2; // Account for the stroke that needs to be added
            let part = '';
            let isEmpty = true;

            // Divide the images up in parts
            if (i !== dimension - 1 || j !== dimension - 1) {
                part = createImage(imageLength, imageLength);
                part.loadPixels();
                for (let x = canvasX; x < canvasX + imageLength; x++) {
                    for (let y = canvasY; y < canvasY + imageLength; y++) {
                        let index = (x + y * img.width) * 4;
                        let partIndex =
                            (x - canvasX + (y - canvasY) * part.width) * 4;
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

            gridItems[i].push(
                new GridItem(i, j, gridItemLength, part, isEmpty)
            );
        }
    }

    document
        .querySelector('.modal-background')
        .addEventListener('click', modalClick);
}

// Function that checks if the user won by comparing gridItem coordinates with coordinates in class
function checkIfWon() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            const gridItem = gridItems[i][j];
            if (gridItem.i !== i || gridItem.j !== j) {
                return false;
            }
        }
    }
    return true;
}

// Drawing output to screen
function draw() {
    // Drawing all the GridItems
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            gridItems[i][j].show();
        }
    }

    if (gameIsGoing) {
        // If the user shuffled and made their first move check if the game is won
        const won = checkIfWon();
        if (won) {
            // Make the grid shuffable again
            document
                .querySelector('.button--shuffle')
                .removeAttribute('disabled');
            // Set the score in the modal
            document.querySelector(
                '.moves-won'
            ).innerHTML = document.querySelector('.moves-passed').innerHTML;
            // Reset the score on the page itself
            document.querySelector('.moves-passed').innerHTML = 0;
            // Open the modal
            document
                .querySelector('.modal-background')
                .removeAttribute('hidden');
            // Game is unshuffled now, so set shuffled to false
            shuffled = false;

            gameIsGoing = false;
        }
    }
}

// Function that finds gridItem based on the position they are in now
function findGridItem(i, j) {
    const flatGridItems = gridItems.reduce((prev, curr) => prev.concat(curr));
    return flatGridItems.find(e => e.i === i && e.j === j);
}

function mousePressed() {
    if (!shuffled) return;

    // Find gridItem the user clicked on
    const i = floor(map(mouseX, 0, width, 0, dimension));
    const j = floor(map(mouseY, 0, height, 0, dimension));
    for (let deltaI = -1; deltaI <= 1; deltaI++) {
        for (let deltaJ = -1; deltaJ <= 1; deltaJ++) {
            // All the one's on the edges have at least one zero so have a sum of -1 or 1
            if (
                deltaI + deltaJ === 0 ||
                deltaI + deltaJ === 2 ||
                deltaI + deltaJ == -2
            )
                continue;
            const absoluteI = i + deltaI;
            const absoluteJ = j + deltaJ;
            if (
                absoluteI >= 0 &&
                absoluteI < dimension &&
                absoluteJ >= 0 &&
                absoluteJ < dimension
            ) {
                const neighbourItem = findGridItem(absoluteI, absoluteJ);
                if (neighbourItem.isEmpty) {
                    const movesHTML = document.querySelector('.moves-passed');
                    movesHTML.innerHTML = Number(movesHTML.innerHTML) + 1;

                    gameIsGoing = true;
                    const centerItem = findGridItem(i, j);
                    neighbourItem.setCoords(i, j);
                    neighbourItem.index = 4 * i + j;
                    centerItem.setCoords(absoluteI, absoluteJ);
                    centerItem.index = 4 * i + j;
                }
            }
        }
    }
}

function countInversions() {
    const flatGridItems = gridItems.reduce((prev, curr) => prev.concat(curr));
    let inversions = 0;

    for (let i = 0; i < flatGridItems.length - 1; i++) {
        for (let j = i + 1; j < flatGridItems.length; j++) {
            if (flatGridItems[i].index > flatGridItems[j].index) inversions++;
        }
    }
    return inversions;
}

function reset() {
    // Reset gridItems array for re-initalization
    gridItems = [];

    // Make grid 'shuffable' again
    document.querySelector('.button--shuffle').removeAttribute('disabled');

    // Reset moves counter
    document.querySelector('.moves-passed').innerHTML = 0;

    // Reset the onclick handler for the modal background
    document
        .querySelector('.modal-background')
        .removeEventListener('click', modalClick);

    // Grid is unshuffled now so we set shuffled to false
    shuffled = false;

    setup();
}

function shuffleImages() {
    const possiblePoints = [];
    shuffled = true;
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (gridItems[i][j].isEmpty) continue;
            possiblePoints.push([i, j]);
        }
    }
    const points = shuffle(possiblePoints);
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (gridItems[i][j].isEmpty) continue;
            const newCoords = points.shift();
            gridItems[i][j].setCoords(newCoords[0], newCoords[1]);
            gridItems[newCoords[0]][newCoords[1]].index = i * dimension + j;
        }
    }

    // If there are an odd number of inversions the puzzle is unsolvable, so reshuffle the grid
    if (countInversions() % 2 === 1) shuffleImages();

    // Reset moves and put shuffle button to disabled
    document.querySelector('.button--shuffle').setAttribute('disabled', true);
    document.querySelector('.moves-passed').innerHTML = 0;
}
