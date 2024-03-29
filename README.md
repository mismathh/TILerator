# TILerator [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A CL tool that will be able to generate TIL posts. It will be able to convert text, snippets of code, and images to HTML format

## Install TILerator
Make sure you have [node and npm ](https://nodejs.org/en/download) installed.

```JavaScript
// Install TILerator globally
npm i -g @mismathh/tilerator
```

## Features

Mandatory Features

- Provide `--version` or `-v` flag to view version
- Provide `--help` or `-h` flag to view help/usage message
- Provide a path for a file to generate an html file
- Provide a path for a directory to generate html files for each text file within folder
- Adds HTML markup tags such as `<p>...</p>` to text
- Outputs files to `./til` folder by default
- Handle markdown files

Optional Features

- Parses title from text file to enhance HTML with `<h1>...</h1>` markup tags
- Converts bold text in Markdown syntax to `<b>...</b>` tags
- Converts code blocks in Markdown syntax to `<pre...</pre>` and `<code>...</code>` tags
- Allows a custom output folder path to be passed using `--output` or `-o` flag
- TOML Configuration Support: Custom output directory can be set within a TOML configuration file instead of repeatedly passing it in within the command-line arguments. The `-c` or `--config` flag followed by the path of the TOML configuration file can be used. 

## Usage/Examples

```JavaScript
tilerator [flag] <filePath | directoryPath>
```

Pass in a flag

```JavaScript
tilerator <flag>

--> tilerator -v
```

Pass in a file path or directory path

```JavaScript
tilerator <filePath | directoryPath>

--> tilerator ./examples/example1.txt
```

Use the `-o` or `--output` flag to generate html files in a custom folder

```JavaScript
---> tilerator ./examples/til_Sample.txt -o ./htmlFiles
```

Use the `-c` or `--config` flag to specify all options in a TOML config file

```JavaScript
// Sample config.toml file

// Output directory for generated files
output = "./build"
```

```JavaScript
---> tilerator -c config.toml ./examples/til_Sample.txt
```

### Flags

| Flag          | Description                               |
| ------------- | ----------------------------------------- |
| -v, --version | Displays version of tool                  |
| -h, --help    | Display help/usage menu                   |
| -o, --output  | Allows for custom output folder           |
| -c, --config  | Specify all options in a TOML config file |

> Custom output folder path must be placed right after `-o/--output` flag
