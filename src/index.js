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
    input.length === 2
  ) {
    // Still need to implement
    console.log("Output flag detected");
  } else if (input.length === 1 && !input[0].startsWith("-")) {
    utils.determinePath(input[0]);
  } else {
    console.error(
      "Invalid arguments provided. Enter TILerator --help for more information.\n"
    );
  }
}
