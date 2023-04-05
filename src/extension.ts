import * as vscode from "vscode";
import { generateTypeScriptTypes } from "./generateTypeScriptTypes";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.generateTypeScriptTypes",
    async (uri: vscode.Uri) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage(
          "No active editor or selected JSON file found."
        );
        return;
      }
      if (!uri) {
        uri = editor.document.uri;
      }

      try {
        const json = (await vscode.workspace.fs.readFile(uri)).toString();
        const types = generateTypeScriptTypes(json);
        const filePathParts = editor.document.uri.path.split("/");
        const fileNameWithExtension = filePathParts.pop() || "";
        const fileNameParts = fileNameWithExtension.split(".");
        const _fileExtension = fileNameParts.pop();
        const fileNameWithoutExtension = fileNameParts.join(".");

        const newFileName = `${fileNameWithoutExtension}.types.ts`;

        const newFileUri = vscode.Uri.parse(
          "untitled:" +
            editor.document.uri.path.replace(/\/[^/]+$/, `/${newFileName}`)
        );

        const newEditor = await vscode.workspace.openTextDocument(newFileUri);
        await vscode.window.showTextDocument(newEditor);
        await vscode.window.activeTextEditor?.edit((editBuilder) => {
          editBuilder.insert(new vscode.Position(0, 0), types);
        });
      } catch (error: any) {
        vscode.window.showErrorMessage(
          "Error generating TypeScript types: " + error.message
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
