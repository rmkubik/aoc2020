const fs = require("fs").promises;
const path = require("path");

async function readLines() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");

  return file.split("\n").map((line) => line.trim());
}

function buildGrid(lines) {
  return lines.map((line) => line.split(""));
}

function buildPath(grid, slope) {
  const path = [];
  const locations = [];
  const rowLength = grid[0].length;

  let currentCol = 0;

  for (let row = slope.row; row < grid.length; row += slope.row) {
    const col = (currentCol += slope.col) % rowLength;
    path.push(grid[row][col]);
    locations.push([row, col]);
  }

  return [path, locations];
}

async function run() {
  const lines = await readLines();
  const grid = buildGrid(lines);

  const slopes = [
    {
      row: 1,
      col: 1,
    },
    {
      row: 1,
      col: 3,
    },
    {
      row: 1,
      col: 5,
    },
    {
      row: 1,
      col: 7,
    },
    {
      row: 2,
      col: 1,
    },
  ];

  const treeCounts = slopes.map((slope) => {
    const [path] = buildPath(grid, slope);
    const treeCount = path.reduce(
      (count, location) => (location === "#" ? count + 1 : count),
      0
    );

    return treeCount;
  });
  const product = treeCounts.reduce((total, current) => total * current);

  console.log(product);
}

run();
