const fs = require("fs").promises;
const path = require("path");

function reduceEntries(entries) {
  return entries.reduce((obj, [key, value]) => {
    return {
      ...obj,
      [key]: value,
    };
  }, {});
}

async function readLines() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");

  return file.split("\n").map((line) => line.trim());
}

function splitChunks(lines) {
  let currentChunk = 0;
  const chunks = [];

  lines.forEach((line) => {
    if (line.length === 0) {
      // chunk divider
      // move on to next chunk and skip blank line
      currentChunk += 1;
      return;
    }

    if (!chunks[currentChunk]) {
      chunks[currentChunk] = [];
    }

    chunks[currentChunk].push(line);
  });

  return chunks;
}

function parseChunk(chunk) {
  const passport = chunk.reduce((evaluated, currentLine) => {
    const entryStrings = currentLine.split(" ");
    const entries = entryStrings.map((entryString) => entryString.split(":"));

    return {
      ...evaluated,
      ...reduceEntries(entries),
    };
  }, {});

  return passport;
}

function areAllRequiredFieldsPresent(passport) {
  const requiredKeys = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
  const keys = new Set(Object.keys(passport));

  return requiredKeys.every((requiredKey) => keys.has(requiredKey));
}

function isHeightValid(height) {
  const heightRegex = /^(\d+)(cm|in)$/;

  if (!heightRegex.test(height)) {
    return false;
  }

  const [, value, unit] = height.match(heightRegex);

  if (unit === "cm") {
    return value >= 150 && value <= 193;
  }

  if (unit === "in") {
    return value >= 59 && value <= 76;
  }
}

function isHairColorValid(hairColor) {
  const hairColorRegex = /^#[\dabcdef]+$/;

  return hairColorRegex.test(hairColor) && hairColor.length === 7;
}

function isValidPassport(passport) {
  if (!areAllRequiredFieldsPresent(passport)) {
    return false;
  }

  // birth year
  if (
    passport.byr.length !== 4 ||
    parseInt(passport.byr) < 1920 ||
    parseInt(passport.byr) > 2002
  ) {
    return false;
  }

  // issue year
  if (
    passport.iyr.length !== 4 ||
    parseInt(passport.iyr) < 2010 ||
    parseInt(passport.iyr) > 2020
  ) {
    return false;
  }

  // expiration year
  if (
    passport.eyr.length !== 4 ||
    parseInt(passport.eyr) < 2020 ||
    parseInt(passport.eyr) > 2030
  ) {
    return false;
  }

  if (!isHeightValid(passport.hgt)) {
    return false;
  }

  if (!isHairColorValid(passport.hcl)) {
    return false;
  }

  const eyeColors = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);
  if (!eyeColors.has(passport.ecl)) {
    return false;
  }

  if (passport.pid.length !== 9) {
    return false;
  }

  return true;
}

async function run() {
  const lines = await readLines();
  const chunks = splitChunks(lines);
  const passports = chunks.map(parseChunk);
  const validPassports = passports.filter(isValidPassport);

  console.log(validPassports.length);
}

run();
