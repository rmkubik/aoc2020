const fs = require("fs").promises;
const path = require("path");

async function readLines() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");

  return file.split("\n").map((line) => line.trim());
}

function isTargetInPreamble(preamble, target) {
  for (let a = 0; a < preamble.length; a++) {
    for (let b = 0; b < preamble.length; b++) {
      if (preamble[a] === preamble[b]) {
        // skip this comparison if 2 numbers are the same
        // we don't want to compare against ourselves
        continue;
      }

      if (preamble[a] + preamble[b] === target) {
        return true;
      }
    }
  }

  return false;
}

function findRange(numbers, target) {
  let currentSum;
  let range;

  for (let i = 0; i < numbers.length; i++) {
    currentSum = 0;
    range = [];

    for (let sumIndex = i; sumIndex < numbers.length; sumIndex++) {
      currentSum += numbers[sumIndex];
      range.push(numbers[sumIndex]);

      if (currentSum === target) {
        return { range, i, sumIndex };
      }

      if (currentSum > target) {
        break;
      }
    }
  }
}

async function run() {
  const lines = await readLines();
  const numbers = lines.map((line) => parseInt(line, 10));

  // part 1
  const preambleLength = 25;
  const preamble = numbers.slice(0, preambleLength);
  let invalidNumber;

  for (let i = preambleLength; i < numbers.length; i++) {
    const target = numbers[i];

    if (!isTargetInPreamble(preamble, target)) {
      invalidNumber = target;
      break;
    }

    preamble.shift();
    preamble.push(target);
  }

  console.log(invalidNumber);

  // part 2
  const { range } = findRange(numbers, invalidNumber);
  console.log(range);
  console.log(Math.min(...range) + Math.max(...range));
}

run();
