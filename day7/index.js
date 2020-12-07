const fs = require("fs").promises;
const path = require("path");

async function readLines() {
  const inputPath = path.join(__dirname, "input.txt");
  const file = await fs.readFile(inputPath, "utf8");

  return file.split("\n").map((line) => line.trim());
}

function splitLines(line) {
  const [parent, childString] = line.split("contain");
  const children = childString.split(",").map((child) => child.trim());

  return {
    parent: parent.trim(),
    children,
  };
}

function parseChild(child) {
  const firstSpaceIndex = child.indexOf(" ");
  const quantity = parseInt(child.slice(0, firstSpaceIndex));
  const bagString = child.slice(firstSpaceIndex + 1);
  const name = parseBagString(bagString);

  if (name === "other") {
    // if name is other then we have no children
    return {
      quantity: 0,
      name: "",
    };
  }

  return {
    name,
    quantity,
  };
}

function parseBagString(bagString) {
  const bagRegex = /(.*) bags?.?/u;
  const [, name] = bagString.match(bagRegex);

  return name;
}

function doesNodeHaveChild(node, name) {
  return node.children.some((child) => child.name === name);
}

function traverseUp(nodes, targetNode) {
  const parents = nodes.filter((node) =>
    doesNodeHaveChild(node, targetNode.parent.name)
  );

  if (parents.length > 0) {
    return [
      ...parents,
      ...parents.map((parent) => traverseUp(nodes, parent)).flat(1),
    ];
  }

  // base case, no parent was found
  return [];
}

function getNodeName(node) {
  return node.parent.name;
}

function totalChildren(node) {
  return node.children.reduce((total, child) => total + child.quantity, 0);
}

function sum(array) {
  return array.reduce((total, current) => total + current, 0);
}

function totalAllChildren(nodes, root) {
  const childNodes = root.children.map((child) => {
    return nodes.find((node) => getNodeName(node) === child.name);
  });
  const grandChildTotals = childNodes.map(
    (childNode, index) =>
      totalAllChildren(nodes, childNode) * root.children[index].quantity
  );

  const grandChildrenTotal = sum(grandChildTotals);

  return totalChildren(root) + grandChildrenTotal;
}

async function run() {
  const lines = await readLines();
  const nodes = lines.map(splitLines);
  const bagNodes = nodes.map((node) => {
    return {
      children: node.children
        .map(parseChild)
        .filter((child) => child.quantity > 0),
      parent: { name: parseBagString(node.parent), quantity: 1 },
    };
  });

  // part 1
  const shinyGoldLeafNodes = bagNodes.filter((node) =>
    doesNodeHaveChild(node, "shiny gold")
  );
  const traversals = shinyGoldLeafNodes.map((leaf) =>
    traverseUp(bagNodes, leaf)
  );
  const initialColors = shinyGoldLeafNodes.map(getNodeName);
  const traversedColors = traversals
    .map((nodes) => nodes.map(getNodeName))
    .flat(1);
  const allColors = [...initialColors, ...traversedColors];
  const uniqueColors = new Set(allColors);
  console.log(uniqueColors.size);

  // part 2
  const root = bagNodes.find((node) => getNodeName(node) === "shiny gold");
  console.log(totalAllChildren(bagNodes, root));
}

run();
