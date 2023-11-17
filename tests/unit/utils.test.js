const { determinePath } = require("../../src/utils");
const fs = require("fs");

afterAll(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("determinePath() tests", () => {
  test("should be able to process a file with exit code 0", async () => {
    const mockStdOut = jest.spyOn(console, "log").mockImplementation();
    const mockExit = jest.spyOn(process, "exit").mockImplementation();

    await new Promise((resolve) => {
      determinePath(["./examples/markdown_Sample.md"]);
      setTimeout(resolve, 100);
    });
    expect(mockStdOut).toHaveBeenLastCalledWith(
      "File successfully written at: ./til/markdown_Sample.html"
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should be able to process directory", async () => {
    const mockStdOut = jest.spyOn(console, "log").mockImplementation();
    const mockExit = jest.spyOn(process, "exit").mockImplementation();

    await new Promise((resolve) => {
      determinePath(["./examples/Valid_Folder"]);
      setTimeout(resolve, 100);
    });
    expect(mockStdOut).toHaveBeenLastCalledWith(
      expect.stringContaining("File successfully written at:")
    );
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should exit with exit code -1 and error message if invalid file path is given", async () => {
    const mockStdErr = jest.spyOn(console, "error").mockImplementation();
    const mockExit = jest.spyOn(process, "exit").mockImplementation();

    await new Promise((resolve) => {
      determinePath(["./examples/markdown_Sample"]);
      setTimeout(resolve, 100);
    });
    expect(mockStdErr).toHaveBeenLastCalledWith("Path does not exist. \n");
    expect(mockExit).toHaveBeenCalledWith(-1);
  });
});

test("should write files to custom output folder", async () => {
  const mockStdOut = jest.spyOn(console, "log").mockImplementation();
  const mockExit = jest.spyOn(process, "exit").mockImplementation();
  const mockFsWriteFileSync = jest
    .spyOn(fs, "writeFileSync")
    .mockImplementation();

  await new Promise((resolve) => {
    determinePath(["./examples/markdown_Sample.md"], "./custom-output");
    setTimeout(resolve, 100);
  });

  expect(mockFsWriteFileSync).toHaveBeenCalledWith(
    expect.stringContaining("./custom-output/"),
    expect.any(String)
  );

  expect(mockStdOut).toHaveBeenLastCalledWith(
    expect.stringContaining("File successfully written at:")
  );
  expect(mockExit).toHaveBeenCalledWith(0);
});
