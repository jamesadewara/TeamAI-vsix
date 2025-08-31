import * as vscode from 'vscode';
import { getWebviewContent } from './webviewProvider';

export function activate(context: vscode.ExtensionContext) {
    // console.log('TeamAI extension is now active!');

    let disposable = vscode.commands.registerCommand('teamai.openPanel', () => {
        const panel = vscode.window.createWebviewPanel(
            'teamaiPanel',
            'TeamAI',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'webview', 'dist')]
            }
        );

        panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}