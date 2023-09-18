#! /usr/bin/env node
const utils = require("../src/utils.js");

// Check if user has provided an argument
if (process.argv.length === 2) {
  console.error(
    "Please provide a path to a directory as an argument. Enter TILerator --help for more information.\n"
  );
} else {
  // Remove first two arguments from process.argv
  const input = process.argv.slice(2);

  if (input.includes("-v") || input.includes("--version")) {
    utils.displayVersion();
  } else if (input.includes("-h") || input.includes("--help")) {
    utils.helpManual();
  } else if (
    (input.includes("-o") || input.includes("--output")) &&
    input.length === 3
  ) {
    let filePath = "";
    let outputFolder = "";

    if (input[0] === "-o" || input[0] === "--output") {
      outputFolder = input[1];
      filePath = input[2];
    } else if (input[1] === "-o" || input[1] === "--output") {
      outputFolder = input[2];
      filePath = input[0];
    }
    utils.determinePath([filePath], outputFolder);
  } else if (input.length === 1 && !input[0].startsWith("-")) {
    utils.determinePath([input[0]]);
  } else {
    console.error(
      "Invalid arguments provided. Enter TILerator --help for more information.\n"
    );
  }
}
