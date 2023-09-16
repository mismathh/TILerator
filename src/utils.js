const fs = require("fs");
const { version } = require("../package.json");

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
const manageOutputFolder = (path = "./til") => {
  /* TODO: Need to validate custom output path*/

  // Start a fresh output folder
  if (fs.existsSync(path)) {
    console.log("Directory exists... Removing folder");
    try {
      fs.rmSync(path, { recursive: true });
      console.log("Directory successfully removed");
      fs.mkdirSync(path);
      console.log("Directory successfully created");
    } catch {
      console.error(err);
    }
  } else {
    console.log("Directory does not exist... Creating output directory");
    try {
      fs.mkdirSync(path);
      console.log("Directory successfully created");
    } catch (err) {
      console.error(err);
    }
  }
}

/* Generate HTML file from the text that is passed in */
const generateHTML = (fileData) => {
  files = fileData;

  // Reset output folder
  manageOutputFolder();

  // Generate HTML file for each text file
  for (i = 0; i < fileData.length; i++) {
    let title_markup = "<h1>" + files[i][0] + "</h1>";

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
      ${files[i][1].join("\n\t\t\t")}
    </body>
    </html>`;

    // Write text to HTML file -- Need to update for custom output path
    try {
      fs.writeFileSync(`./til/${files[i][0]}.html`, html);
      // need to update for custom output path
      console.log(`File successfully written at: ./till/${files[i][0]}.html`);
    } catch (err) {
      console.error(err);
    }
  }
};

/* Read text from given paths and add markup*/
const readFileFromPath = (path) => {
  let fileData = [];

  // Read text file that is found from each path given
  for (i = 0; i < path.length; i++) {
    let data = fs.readFileSync(path[i], "utf8");
    let lines = data.split("\n");
    let title = "";
    let markupTitle = "";

    // Check if there is a title in text file
    if (
      lines.length >= 3 &&
      lines[0].length > 0 &&
      lines[1] === "\r" &&
      lines[2] === "\r"
    ) {
      title = lines[0].substring(0, lines[0].length - 1)
      markupTitle = `<h1>${title}</h1>`;
      lines.splice(0, 3);
    }

    // Add <p>/</p> tags to first and last line
    if (lines[0] != "\r") {
      lines[0] = `<p>${lines[0]}`;
    }
    lines[lines.length - 1] = lines[lines.length - 1] + "</p>";

    /* For each line, add markup tags */
    for (let j = 0; j < lines.length; j++) {

      /* if there is empty line after current line, then add </p> to current line */
      if (
        lines[j] != "\r" &&
        lines[j].endsWith("\r") &&
        lines[j + 1] === "\r"
      ) {
        lines[j] = lines[j].substring(0, lines[j].length - 1) + "</p>";
      }

      /* if there is no empty line after current line, then remove new line character */
      if (
        lines[j].endsWith("\r") &&
        lines[j + 1].length > 0 &&
        lines[j + 1] != "\r"
      ) {
        if (lines[j] != "\r") {
          lines[j] = lines[j].substring(0, lines[j].length - 1);
        }
      }

      /* if there is empty line before current line, then add <p> to current line */
      if (j > 0 && lines[j - 1] === "\r" && lines[j] != "\r") {
        lines[j] = "<p>" + lines[j];
      }
    }

    // Remove empty lines
    lines.forEach((line, index) => {
      if (line.endsWith("\r")) {
        //lines[index] = "";
        lines.splice(index, 1);
      }
    });

    // Putting back title with markup
    if (title != "") {
    lines.unshift(markupTitle);
    }

    // Push title and lines to array
    let arr = [title, lines];
    fileData.push(arr);
  }
  generateHTML(fileData);
};

/* Determines if path received is a file or directory path */
const determinePath = (path) => {
  let directoryFilePaths = [];
  let filePathArray = [path];
  
  try {
    // Check if path is a file or directory
    if (fs.statSync(path).isFile()) {
      console.log("Received file path. \n");
      readFileFromPath(filePathArray);
    } else if (fs.statSync(path).isDirectory()) {
      console.log("This is a directory path. \n");

      // Read directory and get all file paths
      fs.readdir(path, (err, files) => {
        if (err) {
          console.error(err);
          return;
        } else {
          for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith(".txt")) {
              directoryFilePaths.push(`${path}/${files[i]}`);
            }
          }

          readFileFromPath(directoryFilePaths);
        }
      });
    }
  } catch (err) {
    console.error("Unable to access path. \nPlease make sure path is correct. \n");
  }
};

module.exports = {
  displayVersion,
  helpManual,
  determinePath,
};
