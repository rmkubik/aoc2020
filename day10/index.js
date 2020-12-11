const fs = require("fs").promises;
const path = require("path");

async function readLines() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");

  return file.split("\n").map((line) => line.trim());
}

function factorialize(num) {
  // If the number is less than 0, reject it.
  if (num < 0) return -1;
  // If the number is 0, its factorial is 1.
  else if (num == 0) return 1;
  // Otherwise, call the recursive procedure again
  else {
    return num * factorialize(num - 1);
  }
}

function calculatePermutations(array) {
  return factorialize(array.length);
}

function findDifferences(numbers) {
  const differences = {
    1: 0,
    2: 0,
    3: 0,
  };

  let prevNumber = numbers[0];

  numbers.slice(1).forEach((number) => {
    const difference = number - prevNumber;

    differences[difference] += 1;

    prevNumber = number;
  });

  return differences;
}

function findPermutations(numbers) {
  // const permutations = {};
  // numbers.forEach((number, index) => {
  //   const chargersInRange = numbers
  //     .slice(index + 1)
  //     .filter((otherNumber) => otherNumber <= number + 3);
  //   // ignore number if it's already in previous numbers chargersInRange
  //   if (true) {
  //     permutations[number] = chargersInRange;
  //   }
  // });
  //
  let permutations = 1;
  let chargersInRange = [];

  for (
    let index = 0;
    index < numbers.length - 1;
    index += chargersInRange.length // + 1
  ) {
    const number = numbers[index];

    chargersInRange = numbers
      .slice(index + 1)
      .filter((otherNumber) => otherNumber <= number + 3);

    // chargersInRange.pop();

    console.log(chargersInRange);
    permutations *= calculatePermutations(chargersInRange);

    // if (chargersInRange.length === 2) {
    //   permutations *= 2;
    // }

    // if (chargersInRange.length === 3) {
    //   permutations *= 4;
    // }
  }

  return permutations;
}

// borrowed from reddit
// https://github.com/dmshvetsov/adventofcode/blob/master/2020/10/2.js
// uses an implementation of the tribonnacci sequence using
// dyanmic programming to make it efficient
// explanation of general algorithm and why to use trib sequence:
// https://www.reddit.com/r/adventofcode/comments/kacdbl/2020_day_10c_part_2_no_clue_how_to_begin/gfayvqn/
function solution(data) {
  return data
    .reduce(
      (computed, jolt) => {
        computed[jolt] =
          (computed[jolt - 3] || 0) +
          (computed[jolt - 2] || 0) +
          (computed[jolt - 1] || 0);
        return computed;
      },
      [1]
    )
    .pop();
}

async function run() {
  const lines = await readLines();
  const numbers = lines.map((line) => parseInt(line, 10));

  numbers.sort((a, b) => a - b);

  // add final jump to your device
  // numbers.unshift(0);
  // numbers.push(numbers[numbers.length - 1] + 3);

  // part 1
  const differences = findDifferences(numbers);

  console.log(differences);
  console.log(differences[1] * differences[3]);

  // part 2
  console.log(numbers);
  const permutations = solution(numbers);

  console.log(permutations);
}

/*
4 5 6 7
4 5 7
4 6 7
4 7

10 11 12
10 12
*/

run();
