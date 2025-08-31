"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewContent = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
function getWebviewContent(webview, extensionUri) {
    // Get the path to the dist folder
    const distPath = vscode.Uri.joinPath(extensionUri, 'webview', 'dist');
    // Read the built index.html file
    const htmlPath = vscode.Uri.joinPath(distPath, 'index.html');
    try {
        const htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');
        // Update resource URLs to use webview URIs
        const updatedContent = htmlContent.replace(/(src|href)="([^"]*)"/g, (match, attr, url) => {
            if (url.startsWith('http') || url.startsWith('data:')) {
                return match;
            }
            const resourceUri = vscode.Uri.joinPath(distPath, url);
            const webviewUri = webview.asWebviewUri(resourceUri);
            return `${attr}="${webviewUri}"`;
        });
        return updatedContent;
    }
    catch (error) {
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
exports.getWebviewContent = getWebviewContent;
//# sourceMappingURL=webviewProvider.js.map