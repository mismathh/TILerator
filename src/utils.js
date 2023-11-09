// Imports
const fs = require("fs");
const path = require("path");
const { version } = require("../package.json");
const markdownToHTML = require("./markdownToHTML.js");
const parseCodeBlock = require("./parseCodeBlock");

/* Help message that shows how to use tool and the options that are available */
const helpManual = () => {
  console.log(`===============================================
Tool Usage Manual

Usage: TILerator [flag] <filePath | directoryPath>

Flag Options:
    --help,    -h      Show help manual
    --version, -v      Show tool version
    --output,  -o      Custom output directory -- need to implement
    --config,  -c      Specify all options in a TOML config file
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
      process.exit(-1);
    }
  } else {
    console.log("Directory does not exist... Creating output directory");
    try {
      fs.mkdirSync(outputFolder);
      console.log("Directory successfully created");
    } catch (err) {
      console.error(err);
      process.exit(-1);
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

    // Write input to HTML file -- Need to update for custom output path
    try {
      fs.writeFileSync(
        `${outputFolder}/${path.basename(
          filePath[i],
          path.extname(filePath[i])
        )}.html`,
        html
      );
      // need to update for custom output path
      console.log(
        `File successfully written at: ${outputFolder}/${path.basename(
          filePath[i],
          path.extname(filePath[i])
        )}.html`
      );
    } catch (err) {
      console.error(err);
      process.exit(-1);
    }
  }
  process.exit(0);
};

const addHTMLMarkup = (lines, fileType) => {
  let body = lines;
  let markupTitle = "";
  let paragraphs = [""];
  let startIndex = 0;
  let codeBlockStartIndex = -1;
  let codeBlockEndIndex = -1;
  let pIndex = 0;

  // Parse markdown tags
  if (fileType === "md") {
    // Loop through to check for code blocks
    for (i = 0; i < body.length; i++) {
      if (body[i] === "```" && codeBlockStartIndex === -1) {
        codeBlockStartIndex = i;
      } else if (body[i] === "```" && codeBlockStartIndex !== -1) {
        codeBlockEndIndex = i;
      }

      // If code block is found, parse it and join to form one paragraph
      if (codeBlockStartIndex !== -1 && codeBlockEndIndex !== -1) {
        body[codeBlockStartIndex] =
          body
            .slice(codeBlockStartIndex, codeBlockEndIndex)
            .join("\n\t\t\t\t\t") + body[codeBlockEndIndex];
        for (j = codeBlockStartIndex + 1; j <= codeBlockEndIndex; j++) {
          body[j] = "";
        }
        codeBlockStartIndex = -1;
        codeBlockEndIndex = -1;
      }
    }

    // Parse markdown to HTML tags
    body = body.map((line) => parseCodeBlock(line));
    body = body.map((line) => markdownToHTML(line));
  }

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

    // Move index to next line if there are multiple empty lines
    while (body[startIndex] === "" && startIndex < body.length - 1) {
      startIndex++;
      i++;
    }

    if (i === body.length - 1) {
      paragraphs[pIndex] = body.slice(startIndex, i + 1).join(" ");
    }
  }

  let markupParagraphs = paragraphs.map((paragraph, index) => {
    if (!paragraph.startsWith("<pre>") && !paragraph.endsWith("</pre>")) {
      return `<p>${paragraph}</p>`;
    } else {
      return paragraph;
    }
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
      process.exit(-1);
    }
    const fileType = filePath[a].split(".").pop();
    markupData.push(addHTMLMarkup(data.split("\r\n"), fileType));
  }

  try {
    // Reset output folder
    manageOutputFolder(outputFolder);

    generateHTML(markupData, filePath, outputFolder);
  } catch (err) {
    console.error(`Error while processing text file\nError: ${err}`);
    process.exit(-1);
  }
};

/* Determines if path received is a file or directory path */
const determinePath = (inputPath, outputFolder = "./til") => {
  let directoryFilePath = [];
  try {
    // Check if path is a text file or directory and try to read it
    const fileTypes = [".txt", ".md"];

    if (
      fs.statSync(inputPath[0]).isFile() &&
      fileTypes.includes(path.extname(inputPath[0]))
    ) {
      console.log("File path received. \n");
      readFileFromPath(inputPath, outputFolder);
    } else if (fs.statSync(inputPath[0]).isDirectory()) {
      console.log("Directory path received. \n");

      // Read directory and get all file paths
      fs.readdir(inputPath[0], (err, files) => {
        if (err) {
          console.error(`Unable to read directory.\nError: ${err}`);
          process.exit(-1);
        } else {
          // Get all file paths from directory that end with .txt or .md
          for (let i = 0; i < files.length; i++) {
            if (fileTypes.includes(path.extname(files[i]))) {
              directoryFilePath.push(`${inputPath[0]}/${files[i]}`);
            }
          }

          readFileFromPath(directoryFilePath, outputFolder);
        }
      });
    } else {
      console.error(`Path does not point to a text file. \n`);
      process.exit(-1);
    }
  } catch (err) {
    console.error(`Unable to access path.`);
    if (err.code === "ENOENT") {
      console.error(`Path does not exist. \n`);
    } else {
      console.error(err);
    }
    process.exit(-1);
  }
};

module.exports = {
  displayVersion,
  helpManual,
  determinePath,
};
