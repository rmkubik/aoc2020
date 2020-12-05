const fs = require("fs").promises;
const path = require("path");

async function readLines() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");

  return file.split("\n").map((line) => line.trim());
}

function splitSequences(line) {
  const divisionIndex = 7;

  const row = line.slice(0, divisionIndex).split("");
  const col = line.slice(divisionIndex).split("");

  return {
    row,
    col,
  };
}

function binarySearch(instructions, { min, max }) {
  const current = { min, max };

  instructions.forEach((instruction) => {
    const difference = current.max - current.min;

    if (instruction === "F" || instruction === "L") {
      current.max = Math.ceil(current.max - difference / 2);
    }

    if (instruction === "B" || instruction === "R") {
      current.min = Math.ceil(current.min + difference / 2);
    }
  });

  return current.min;
}

function calculateSeatId({ row, col }) {
  return row * 8 + col;
}

function findGapInSequece(sequence) {
  let prevValue;

  const valueAfterGap = sequence.find((value) => {
    if (!prevValue) {
      // This is our first item, just initialize prevValue as
      // value -1 (even though that doesn't exist)
      // The rules to the challenge say we can't be the first or last
      // seat.

      prevValue = value - 1;
    }

    // If diff between current value and prev is greater than one
    // then we skipped a number
    if (value - prevValue > 1) {
      return true;
    }

    prevValue = value;
    return false;
  });

  return valueAfterGap - 1;
}

async function run() {
  const lines = await readLines();
  const sequences = lines.map(splitSequences);

  const seatPositions = sequences.map(
    ({ row: rowSequence, col: colSequence }) => {
      const row = binarySearch(rowSequence, { min: 0, max: 127 });
      const col = binarySearch(colSequence, { min: 0, max: 7 });

      return { row, col };
    }
  );

  // the hard way I did originally 👆
  // the easy way 👇
  const binaryStrings = {
    row: sequences[0].row.map((char) => (char === "F" ? 0 : 1)).join(""),
    col: sequences[0].col.map((char) => (char === "L" ? 0 : 1)).join(""),
  };
  const decimal = {
    row: parseInt(binaryStrings.row, 2),
    col: parseInt(binaryStrings.col, 2),
  };
  console.log(decimal);
  // end easy way example

  const seats = seatPositions.map((position) => {
    return {
      ...position,
      id: calculateSeatId(position),
    };
  });

  const ids = seats.map((seat) => seat.id);
  const highestId = Math.max(...ids);
  console.log(highestId);

  // JS does not default to a numeric sort
  const sortedIds = [...ids].sort((a, b) => a - b);
  const ourSeatId = findGapInSequece(sortedIds);

  console.log(ourSeatId);
}

run();
