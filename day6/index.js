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
  const questions = new Set();

  chunk.forEach((line) => {
    line.split("").forEach((question) => {
      questions.add(question);
    });
  });

  return [...questions];
}

function intersection(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function intersectionMany(sets) {
  return sets.reduce((currentIntersection, current) => {
    return intersection(currentIntersection, current);
  });
}

function parseChunk2(chunk) {
  return chunk.map((line) => new Set(line.split("")));
}

function sum(total, current) {
  return total + current;
}

async function run() {
  const lines = await readLines();
  const chunks = splitChunks(lines);

  // part 1
  const questionSets = chunks.map(parseChunk);
  const lengths = questionSets.map((set) => set.length);
  const sum1 = lengths.reduce(sum);
  console.log("part 1", sum1);

  // part 2
  const people = chunks.map(parseChunk2);
  // console.log(people[0]);
  const intersections = people.map(intersectionMany);
  const sizes = intersections.map((set) => set.size);
  const sum2 = sizes.reduce(sum);
  console.log("part 2", sum2);
}

run();
