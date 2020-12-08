const fs = require("fs").promises;
const path = require("path");

async function readLines() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");

  return file.split("\n").map((line) => line.trim());
}

function parseLine(line) {
  const [instruction, value] = line.split(" ");

  return {
    instruction,
    value: parseInt(value),
  };
}

function execute(commands) {
  const executedInstructionIndices = [];

  let accumulator = 0;
  let currentIndex = 0;

  while (!executedInstructionIndices.includes(currentIndex)) {
    executedInstructionIndices.push(currentIndex);

    if (currentIndex >= commands.length) {
      return { accumulator, status: "success" };
    }

    switch (commands[currentIndex].instruction) {
      case "acc":
        accumulator += commands[currentIndex].value;
        currentIndex += 1;
        break;
      case "nop":
        currentIndex += 1;
        break;
      case "jmp":
        currentIndex += commands[currentIndex].value;
        break;
      default:
        console.log(
          `Invalid instruction, ${currentIndex} - ${commands[currentIndex]}`
        );
        break;
    }
  }

  return { accumulator, status: "error" };
}

function findCommands(commands, instruction) {
  const indicies = [];

  commands.forEach((command, index) => {
    if (command.instruction === instruction) {
      indicies.push(index);
    }
  });

  return indicies;
}

function clone(array) {
  return JSON.parse(JSON.stringify(array));
}

async function run() {
  const lines = await readLines();
  const commands = lines.map(parseLine);

  // part 1
  const { accumulator } = execute(commands);
  console.log(accumulator);

  // part 2
  const jmpIndicies = findCommands(commands, "jmp");
  const nopIndicies = findCommands(commands, "nop");

  jmpIndicies.forEach((index) => {
    const newCommands = clone(commands);
    newCommands[index].instruction = "nop";

    const result = execute(newCommands);

    if (result.status === "success") {
      console.log(result.accumulator);
    }
  });

  nopIndicies.forEach((index) => {
    const newCommands = clone(commands);
    newCommands[index].instruction = "jmp";

    const result = execute(newCommands);

    if (result.status === "success") {
      console.log(result.accumulator);
    }
  });
}

run();
