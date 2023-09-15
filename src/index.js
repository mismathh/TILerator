const utils = require("../src/utils.js");

if (process.argv.length === 2) {
  console.log(
    "Please provide a path to a directory as an argument.\nEnter TILerator --help for more information.\n"
  );
} else {
  // Remove first two arguments from process.argv
  const input = process.argv.slice(2);

  if (input[0].startsWith("-") && input.length === 1) {
    switch (input[0]) {
      case "-v":
      case "--version":
        utils.displayVersion();
        break;
      case "-h":
      case "--help":
        utils.helpManual();
        break;
      default:
        console.log("Invalid flag provided.\nEnter TILerator --help for more information.\n");
    }
  } else if (input.length === 1) {
    utils.determinePath(input[0])
  } else if (
    (input[0] === "-o" || input[0] === "--output") &&
    input.length === 3
  ) {
    // Still need to implement
    console.log(
      "Output flag provided. Expected input is a file or directory path + new output path. \n"
    );
  } else {
    console.log("Invalid arguments provided. \nEnter TILerator --help for more information.\n");
  }
}
