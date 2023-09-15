# TILerator [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
A CL tool that will be able to generate TIL posts. It will be able to convert text, snippets of code, and images to HTML format

# Setup
Clone repository and install node packages locally

```
git clone https://github.com/mismathh/TILerator.git
cd TILerator
npm install
```

# Features
Mandatory Features
 - Provide `--version` or `-v` flag to view version
 - Provide `--help` or `-h` flag to view help/usage message
 - Provide a path for a file to generate an html file
 - Provide a path for a directory to generate html files for each text file 
 - Adds HTML markup tags such as `<p>...</p>` to text
 - Outputs files to `./til` folder by default

Optional Features
- Parses title from text file to enhance HTML with `<h1>...</h1>` markup tags
- Allow a custom output folder path to be passed to create HTML file in     **(Work-in-progress)**

# Usage/Examples
Pass in a flag
```
TILerator <flag>

--> TILerator -v
```
Pass in a file path or directory path
```
TILerator <filePath | directoryPath>

--> TILerator ./txtfile.txt
```

## Flags
| Flag | Description |
| ---- | ----------- |
| -v, --version | Displays version of tool |
| -h, --help | Display help/usage menu |
| -o, --output | Allows for custom output folder | 
> -o, --output still needs to be implemented