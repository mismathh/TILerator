// Imports
const fs = require("fs");
const path = require("path");
const { version } = require("../package.json");
const { start } = require( "repl" );

/* Help message that shows how to use tool and the options that are available */
const helpManual = () => {
  console.log(`===============================================
Tool Usage Manual

Usage: TILerator [flag] <filePath | directoryPath>

Flag Options:
    --help,    -h      Show help manual
    --version, -v      Show tool version
    --output,  -o      Custom output directory -- need to implement
===============================================`);
};

/* Function that displays the version of the tool */
const displayVersion = () => {
  console.log(`TILerator tool version: ${version}`);
};

/* Creates/deletes output folder -- Need to implement for custom output folder path*/
const manageOutputFolder = (outputFolder) => {
  // Start a fresh output folder
  if (fs.existsSync(outputFolder)) {
    console.log("Directory exists... Removing folder");
    try {
      fs.rmSync(outputFolder, { recursive: true });
      console.log("Directory successfully removed");
      fs.mkdirSync(outputFolder);
      console.log("Directory successfully created");
    } catch {
      console.error(err);
    }
  } else {
    console.log("Directory does not exist... Creating output directory");
    try {
      fs.mkdirSync(outputFolder);
      console.log("Directory successfully created");
    } catch (err) {
      console.error(err);
    }
  }
};

/* Generate HTML file from the text that is passed in */
const generateHTML = (fileData, filePath, outputFolder) => {
  files = fileData;

  // Generate HTML file for each text file
  for (i = 0; i < fileData.length; i++) {

    if (files[i][0] === "") {
      files[i][0] = `TIL Post ${i + 1}`;
    }

    var html = `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${files[i][0]}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      ${files[i][1]}
    </body>
    </html>`;

    // Write text to HTML file -- Need to update for custom output path
    try {
      fs.writeFileSync(`${outputFolder}/${path.basename(filePath[i], ".txt")}.html`, html);
      // need to update for custom output path
      console.log(`File successfully written at: ${outputFolder}/${path.basename(filePath[i], ".txt")}.html`);
    } catch (err) {
      console.error(err);
    }
  }
};

const addHTMLMarkup = (lines) => {
  let body = lines;
  let markupTitle = "";
  let paragraphs = [""];
  let startIndex = 0;
  let pIndex = 0;

  // Check if there is a title in text file
  if (
    body.length >= 3 &&
    body[0].length > 0 &&
    body[1] === "" &&
    body[2] === ""
  ) {
    markupTitle = `<h1>${body[0]}</h1>`;
    body.splice(0, 3);
  }
  
  for (i = 0; i < body.length; i++) {
    if (body[i] === "") {
      paragraphs[pIndex] = body.slice(startIndex, i).join(" ");
      startIndex = i + 1;
      pIndex++;
      
    }

    if (body[startIndex] === "") {
      startIndex++;
      i++;
    }

    if (i === body.length - 1) {
      paragraphs[pIndex] = body.slice(startIndex, i +1).join(" ");
    }
  }

  let markupParagraphs = paragraphs.map((paragraph, index) => {
    return `<p>${paragraph}</p>`;
  });

  if (markupTitle !== "") {
    markupParagraphs.unshift(markupTitle);
  }

  return [markupTitle, markupParagraphs.join("\n\t\t\t")];
};

/* Read text file(s) from given path(s) and add markup*/
const readFileFromPath = (filePath, outputFolder) => {
  let data = "";
  let markupData = [];

  // Read text file that is found from each path given
  for (a = 0; a < filePath.length; a++) {
    try {
      data = fs.readFileSync(filePath[a], "utf8");
      } catch (err) {
      console.error(`Error while processing text file\nError: ${err}`);
      return;
    }
    markupData.push(addHTMLMarkup(data.split("\r\n")));
  }

  try {
    // Reset output folder
    manageOutputFolder(outputFolder);
  
    generateHTML(markupData, filePath, outputFolder);

  } catch (err) {
    console.error(`Error while processing text file\nError: ${err}`);
    return;
  }
};

/* Determines if path received is a file or directory path */
const determinePath = (inputPath, outputFolder = "./til") => {
  let directoryFilePath = [];
  try {
    // Check if path is a text file or directory and try to read it
    if (
      fs.statSync(inputPath[0]).isFile() &&
      path.extname(inputPath[0]) === ".txt"
    ) {
      console.log("File path received. \n");
      readFileFromPath(inputPath, outputFolder);
    } else if (fs.statSync(inputPath[0]).isDirectory()) {
      console.log("Directory path received. \n");

      // Read directory and get all file paths
      fs.readdir(inputPath[0], (err, files) => {
        if (err) {
          console.error(`Unable to read directory.\nError: ${err}`);
          return;
        } else {
          // Get all file paths from directory that end with .txt
          for (let i = 0; i < files.length; i++) {
            if (path.extname(files[i]) === ".txt") {
              directoryFilePath.push(`${inputPath[0]}/${files[i]}`);
            }
          }

          readFileFromPath(directoryFilePath, outputFolder);
        }
      });
    } else {
      console.error(`Path does not point to a text file. \n`);
    }
  } catch (err) {
    console.error(`Unable to access path.`);
    if (err.code === "ENOENT") {
      console.error(`Path does not exist. \n`);
    } else {
      console.error(err);
    }
  }
};

module.exports = {
  displayVersion,
  helpManual,
  determinePath,
};
