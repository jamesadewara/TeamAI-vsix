import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    // Get the path to the dist folder
    const distPath = vscode.Uri.joinPath(extensionUri, 'webview', 'dist');
    
    // Read the built index.html file
    const htmlPath = vscode.Uri.joinPath(distPath, 'index.html');
    
    try {
        const htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');
        
        // Update resource URLs to use webview URIs
        const updatedContent = htmlContent.replace(
            /(src|href)="([^"]*)"/g, 
            (match, attr, url) => {
                if (url.startsWith('http') || url.startsWith('data:')) {
                    return match;
                }
                
                const resourceUri = vscode.Uri.joinPath(distPath, url);
                const webviewUri = webview.asWebviewUri(resourceUri);
                return `${attr}="${webviewUri}"`;
            }
        );
        
        return updatedContent;
    } catch (error) {
        return `<!DOCTYPE html>
            <html>
            <head>
                <title>TeamAI</title>
            </head>
            <body>
                <div>Error loading webview content: ${error}</div>
            </body>
            </html>`;
    }
}