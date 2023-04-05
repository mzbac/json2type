# JSON to TypeScript Types Generator

Effortlessly generate TypeScript types from JSON data in Visual Studio Code with a single command.

## Features

- Automatically generate TypeScript types from JSON files
- Supports complex and nested JSON structures
- Generates union types for arrays with different element types
- Works with both the Command Palette and the File Explorer context menu

## Usage

There are two ways to use the JSON to TypeScript Types Generator extension:

1. **Command Palette**: Open a JSON file or paste JSON content in an editor, then press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and search for "Generate TypeScript Types" to run the command. The extension will generate TypeScript types and display them in a new file with a `.types.ts` extension.

2. **File Explorer context menu**: Right-click on a JSON file in the File Explorer, then select "Generate TypeScript Types" from the context menu. The extension will generate TypeScript types and display them in a new file with a `.types.ts` extension.

## Installation

1. Open Visual Studio Code.
2. Press `Ctrl+P` (or `Cmd+P` on macOS) to open the Quick Open dialog.
3. Type `ext install mzbac.json2type` and press Enter to install the extension.

## Contributing

If you'd like to contribute to the development of this extension, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/yourusername/json-to-typescript-types-generator).

## License

This extension is released under the [MIT License](https://opensource.org/licenses/MIT).
