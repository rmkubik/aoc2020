const fs = require("fs").promises;
const path = require("path");

async function run() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");
  const numbers = file.split("\n").map((line) => parseInt(line));

  numbers.forEach((firstNumber) => {
    numbers.forEach((secondNumber) => {
      numbers.forEach((thirdNumber) => {
        if (firstNumber + secondNumber + thirdNumber === 2020) {
          console.log(firstNumber * secondNumber * thirdNumber);
        }
      });
    });
  });
}

run();
