const utils = require("functional-game-utils");
const fs = require("fs").promises;
const path = require("path");
const ramda = require("ramda");

const tileTypes = {
  empty: "L",
  occupied: "#",
  floor: ".",
};

async function readLines() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");

  return file.split("\n").map((line) => line.trim());
}

function buildGrid(lines) {
  return lines.map((line) => line.split(""));
}

function calcNextFrame(grid) {
  return utils.mapMatrix((char, location, matrix) => {
    const neighbors = utils.getNeighbors(
      utils.getAllDirections,
      matrix,
      location
    );

    const occupiedNeighborCount = neighbors
      .map((neighborLocation) => utils.getLocation(grid, neighborLocation))
      .reduce((count, neighbor) => {
        if (neighbor === tileTypes.occupied) {
          return count + 1;
        }

        return count;
      }, 0);

    if (char === tileTypes.empty && occupiedNeighborCount === 0) {
      return tileTypes.occupied;
    }

    if (char === tileTypes.occupied && occupiedNeighborCount >= 4) {
      return tileTypes.empty;
    }

    return char;
  }, grid);
}

function getRight(grid, { row, col }) {
  return utils.getRow(grid, row).slice(col + 1);
}

function getLeft(grid, { row, col }) {
  return utils.getRow(grid, row).slice(0, col);
}

function getUp(grid, { row, col }) {
  return utils.getCol(grid, col).slice(0, row);
}

function getDown(grid, { row, col }) {
  return utils.getCol(grid, col).slice(row + 1);
}

function calcNextFrameLineOfSight(grid) {
  return utils.mapMatrix((char, location, matrix) => {
    const neighbors = utils.getNeighbors(
      utils.getAllDirections,
      matrix,
      location
    );

    const occupiedNeighborCount = neighbors
      .map((neighborLocation) => utils.getLocation(grid, neighborLocation))
      .reduce((count, neighbor) => {
        if (neighbor === tileTypes.occupied) {
          return count + 1;
        }

        return count;
      }, 0);

    if (char === tileTypes.empty && occupiedNeighborCount === 0) {
      return tileTypes.occupied;
    }

    if (char === tileTypes.occupied && occupiedNeighborCount >= 4) {
      return tileTypes.empty;
    }

    return char;
  }, grid);
}

function compareMatricies(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  if (a[0].length !== b[0].length) {
    return false;
  }

  for (let row = 0; row < a.length; row++) {
    for (let col = 0; col < a[0].length; col++) {
      if (a[row][col] !== b[row][col]) {
        return false;
      }
    }
  }

  return true;
}

function forEachMatrix(cb, matrix) {
  matrix.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      cb(col, { row: rowIndex, col: colIndex }, matrix);
    });
  });
}

function countSeats(grid) {
  let occupiedSeatCount = 0;

  forEachMatrix((seat) => {
    if (seat === tileTypes.occupied) {
      occupiedSeatCount += 1;
    }
  }, grid);

  return occupiedSeatCount;
}

function findFirstSoluion(grid) {
  let currentFrame = ramda.clone(grid);
  let prevFrame = [[]];

  while (!compareMatricies(prevFrame, currentFrame)) {
    prevFrame = ramda.clone(currentFrame);

    currentFrame = calcNextFrame(currentFrame);
  }

  console.log(countSeats(currentFrame));
}

function findSecondSolution(grid) {}

async function run() {
  const lines = await readLines();
  const grid = buildGrid(lines);

  findFirstSoluion(grid);
}

run();
