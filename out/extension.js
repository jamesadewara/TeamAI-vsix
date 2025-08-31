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
exports.deactivate = exports.activate = void 0;
// src/extension.ts - Fixed dual view setup
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
let currentPanel = undefined;
function activate(context) {
    console.log('TeamAI extension is now active!');
    // Command to open the full React app in a NEW TAB
    let openPanelDisposable = vscode.commands.registerCommand('teamai.openPanel', () => {
        // If panel already exists, just reveal it
        if (currentPanel) {
            currentPanel.reveal(vscode.ViewColumn.One);
            return;
        }
        // Create new panel with React app
        currentPanel = vscode.window.createWebviewPanel('teamaiPanel', 'TeamAI Assistant', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, 'webview', 'dist')
            ]
        });
        // Load the full React app
        currentPanel.webview.html = getReactWebviewContent(currentPanel.webview, context.extensionUri);
        // Reset panel reference when closed
        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
        });
        // Handle messages from React app
        currentPanel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showInformationMessage(message.text);
                    return;
                case 'reload':
                    if (currentPanel) {
                        currentPanel.webview.html = getReactWebviewContent(currentPanel.webview, context.extensionUri);
                    }
                    return;
            }
        }, undefined, context.subscriptions);
    });
    // Command to reload the React app
    let reloadDisposable = vscode.commands.registerCommand('teamai.reload', () => {
        if (currentPanel) {
            currentPanel.webview.html = getReactWebviewContent(currentPanel.webview, context.extensionUri);
            vscode.window.showInformationMessage('TeamAI reloaded!');
        }
        else {
            vscode.window.showWarningMessage('TeamAI panel is not open. Opening now...');
            vscode.commands.executeCommand('teamai.openPanel');
        }
    });
    // Register the SIDEBAR view provider (simple HTML interface)
    const sidebarProvider = new TeamAISidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('teamai-chat', sidebarProvider, {
        webviewOptions: {
            retainContextWhenHidden: true
        }
    }));
    context.subscriptions.push(openPanelDisposable, reloadDisposable);
}
exports.activate = activate;
// Sidebar Provider - Simple HTML interface
class TeamAISidebarProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: []
        };
        // Simple HTML interface for sidebar
        webviewView.webview.html = this.getSidebarHTML(webviewView.webview);
        // Handle messages from sidebar
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'openPanel':
                    vscode.commands.executeCommand('teamai.openPanel');
                    break;
                case 'reload':
                    vscode.commands.executeCommand('teamai.reload');
                    break;
            }
        });
    }
    getSidebarHTML(webview) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TeamAI</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-sidebar-background);
                    margin: 0;
                    padding: 16px;
                    font-size: var(--vscode-font-size);
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .logo {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 12px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                }
                
                h1 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--vscode-foreground);
                }
                
                .subtitle {
                    font-size: 12px;
                    color: var(--vscode-descriptionForeground);
                    margin: 4px 0 0 0;
                }
                
                .button {
                    width: 100%;
                    padding: 12px;
                    margin: 8px 0;
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                .button:hover {
                    background: var(--vscode-button-hoverBackground);
                }
                
                .button.secondary {
                    background: var(--vscode-button-secondaryBackground);
                    color: var(--vscode-button-secondaryForeground);
                }
                
                .button.secondary:hover {
                    background: var(--vscode-button-secondaryHoverBackground);
                }
                
                .status {
                    margin: 16px 0;
                    padding: 12px;
                    background: var(--vscode-textCodeBlock-background);
                    border-radius: 6px;
                    font-size: 12px;
                }
                
                .status-dot {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 8px;
                }
                
                .status-online { background: #22c55e; }
                .status-offline { background: #ef4444; }
                
                .quick-actions {
                    margin-top: 20px;
                    border-top: 1px solid var(--vscode-widget-border);
                    padding-top: 16px;
                }
                
                .quick-actions h3 {
                    font-size: 14px;
                    margin: 0 0 12px 0;
                    color: var(--vscode-foreground);
                }
                
                .action-item {
                    padding: 8px 12px;
                    margin: 4px 0;
                    background: var(--vscode-list-hoverBackground);
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    border: 1px solid transparent;
                }
                
                .action-item:hover {
                    border-color: var(--vscode-focusBorder);
                }
                
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 11px;
                    color: var(--vscode-descriptionForeground);
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🤖</div>
                <h1>TeamAI</h1>
                <p class="subtitle">AI-Powered Collaboration</p>
            </div>
            
            <button class="button" onclick="openMainPanel()">
                🚀 Open TeamAI Assistant
            </button>
            
            <button class="button secondary" onclick="reloadPanel()">
                🔄 Reload Assistant
            </button>
            
            <div class="status">
                <span class="status-dot status-online"></span>
                <strong>Status:</strong> Ready
            </div>
            
            <div class="quick-actions">
                <h3>Quick Actions</h3>
                
                <div class="action-item" onclick="openMainPanel()">
                    💬 Start AI Chat
                </div>
                
                <div class="action-item" onclick="openMainPanel()">
                    👥 Team Collaboration
                </div>
                
                <div class="action-item" onclick="openMainPanel()">
                    📊 Project Insights
                </div>
                
                <div class="action-item" onclick="openMainPanel()">
                    ⚙️ Settings
                </div>
            </div>
            
            <div class="footer">
                TeamAI v1.0.0<br>
                Press Ctrl+Shift+T for quick access
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                
                function openMainPanel() {
                    vscode.postMessage({
                        type: 'openPanel'
                    });
                }
                
                function reloadPanel() {
                    vscode.postMessage({
                        type: 'reload'
                    });
                }
                
                // Optional: Auto-open main panel on first activation
                // setTimeout(() => openMainPanel(), 1000);
            </script>
        </body>
        </html>`;
    }
}
// Function to get the FULL React app content for the tab view
function getReactWebviewContent(webview, extensionUri) {
    const webviewDistPath = vscode.Uri.joinPath(extensionUri, 'webview', 'dist');
    const htmlPath = vscode.Uri.joinPath(webviewDistPath, 'index.html');
    try {
        let htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');
        // Replace all asset paths with webview URIs
        htmlContent = htmlContent.replace(/(href|src)="(\.\/[^"]*)"/g, (match, attr, resourcePath) => {
            const cleanPath = resourcePath.substring(2);
            const resourceUri = vscode.Uri.joinPath(webviewDistPath, cleanPath);
            const webviewUri = webview.asWebviewUri(resourceUri);
            return `${attr}="${webviewUri}"`;
        });
        htmlContent = htmlContent.replace(/(href|src)="((?!https?:\/\/|data:|vscode-webview:)[^"]*)"/g, (match, attr, resourcePath) => {
            const resourceUri = vscode.Uri.joinPath(webviewDistPath, resourcePath);
            const webviewUri = webview.asWebviewUri(resourceUri);
            return `${attr}="${webviewUri}"`;
        });
        // Add CSP and VS Code integration
        const csp = `default-src 'none'; 
                     img-src ${webview.cspSource} https: data:; 
                     script-src ${webview.cspSource} 'unsafe-inline'; 
                     style-src ${webview.cspSource} 'unsafe-inline'; 
                     font-src ${webview.cspSource};`;
        htmlContent = htmlContent.replace('<head>', `<head>
                <meta http-equiv="Content-Security-Policy" content="${csp}">
                <script>
                    window.acquireVsCodeApi = acquireVsCodeApi;
                    const vscode = acquireVsCodeApi();
                </script>`);
        return htmlContent;
    }
    catch (error) {
        console.error('Error loading React webview content:', error);
        return getErrorHTML(error, htmlPath.fsPath);
    }
}
function getErrorHTML(error, expectedPath) {
    return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>TeamAI - Error</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                    padding: 20px;
                    line-height: 1.6;
                }
                .error { color: var(--vscode-errorForeground); }
                .solution {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 15px;
                    border-left: 4px solid var(--vscode-textLink-foreground);
                    margin: 15px 0;
                }
                button {
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <h2>🤖 TeamAI Loading Error</h2>
            <p class="error">Could not load the React webview content.</p>
            <p><strong>Error:</strong> ${error}</p>
            <p><strong>Expected path:</strong> <code>${expectedPath}</code></p>
            
            <div class="solution">
                <h3>💡 Quick Fix:</h3>
                <p>Run these commands:</p>
                <pre>cd webview && npm run build
cd .. && npm run build:extension</pre>
                <button onclick="window.location.reload()">🔄 Retry</button>
            </div>
        </body>
        </html>`;
}
function deactivate() {
    if (currentPanel) {
        currentPanel.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map