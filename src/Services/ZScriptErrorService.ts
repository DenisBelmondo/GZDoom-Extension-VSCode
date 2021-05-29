import * as vscode from "vscode";
import ZScriptError from "../Classes/ZScriptError";

export async function updateDiagnostics(
    documentUri: vscode.Uri,
    diagnosticsCollection: vscode.DiagnosticCollection,
    errorRangesArray: ZScriptError[]
) {
    if (errorRangesArray.length > 0) {
        const diagnosticsArray: vscode.Diagnostic[] = [];

        for (const range of errorRangesArray) {
            diagnosticsArray.push({
                message: range.description ?? "",
                range: range,
                severity: vscode.DiagnosticSeverity.Error,
                source: "zscript",
            });
        }

        diagnosticsCollection.set(documentUri, diagnosticsArray);
    } else {
        diagnosticsCollection.clear();
    }
}

export async function tagUnclosedBrackets(contextChanges: vscode.Position[][], errorRanges: ZScriptError[]) {
    for (const contextTypeChanges of contextChanges) {
        for (const contextChange of contextTypeChanges) {
            const position = new vscode.Position(contextChange.line, contextChange.character);

            errorRanges.push(
                new ZScriptError(
                    position,
                    position,
                    `"${["}", ")", "]"][contextChanges.indexOf(contextTypeChanges)]}" is missing somewhere!`
                )
            );
        }
    }
}
