const fs = require("fs").promises;
const path = require("path");

function xor(a, b) {
  return (a || b) && !(a && b);
}

async function readLines() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");

  return file.split("\n").map((line) => line.trim());
}

function validatePartOne(lines) {
  return lines.filter((line) => {
    const [rule, password] = line.split(": ");
    const [range, targetChar] = rule.split(" ");

    const count = password.split("").reduce((currentCount, char) => {
      if (char === targetChar) {
        return currentCount + 1;
      }

      return currentCount;
    }, 0);

    const [min, max] = range.split("-");

    return count >= min && count <= max;
  });
}

function validatePartTwo(lines) {
  return lines.filter((line) => {
    const [rule, password] = line.split(": ");
    const [positions, targetChar] = rule.split(" ");
    const [pos1, pos2] = positions.split("-");

    return xor(
      password.charAt(pos1 - 1) === targetChar,
      password.charAt(pos2 - 1) === targetChar
    );
  });
}

async function run() {
  const lines = await readLines();

  const validLines1 = validatePartOne(lines);
  console.log("part one", validLines1.length);

  const validLines2 = validatePartTwo(lines);
  console.log("part two", validLines2.length);
}

run();
