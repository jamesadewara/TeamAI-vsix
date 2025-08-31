# 🚀 TeamAI - AI-Powered Developer Collaboration

![TeamAI Logo](media/icon.png)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=james-adewara.teamai-vsce-extension)
[![AI-Powered](https://img.shields.io/badge/AI-Powered-blue)](https://github.com/jamesadewara/TeamAI-vsix)
[![Collaboration](https://img.shields.io/badge/Collaboration-Ready-green)](https://github.com/jamesadewara/TeamAI-vsix)

## 📽️ Demo Video
[Watch on YouTube](https://youtube.com/shorts/QO66oRWXo-A)

## 📝 Overview

TeamAI is a collaborative platform designed to **streamline communication and productivity among developers**. It integrates AI assistance directly into developer workflows, starting as a **VS Code extension prototype** and expanding into a **web and mobile ecosystem**.

### 💡 The Problem We Solve

Software teams often struggle with:
- 🔄 Communication gaps across different roles (frontend, backend, PM, QA)
- ⚡ Inefficient context switching between multiple tools
- 🤖 Lack of real-time AI-powered assistance in coding environments
- 📊 Difficulty tracking project progress across team members

**TeamAI solves this by embedding AI and collaboration tools directly inside your IDE.**

## ✨ Key Features

### 🧑‍🤝‍🧑 Role-Specific Collaboration
- **Frontend Developers**: UI/UX focused AI suggestions, component optimization
- **Backend Developers**: API design, database optimization, architecture advice  
- **Project Managers**: Progress tracking, task prioritization, team insights
- **QA Engineers**: Test case generation, bug analysis, quality metrics

### 🤖 AI-Assisted Development
- **Local AI Inference**: Powered by Ollama DeepSeek (6B parameters)
- **Context-Aware Suggestions**: Understands your project structure
- **Code Review Assistant**: Automated code analysis and improvement suggestions
- **Documentation Generator**: Auto-generate docs from your code

### 🔄 Real-Time Synchronization
- **Live Project Updates**: See what teammates are working on
- **Shared AI Conversations**: Collaborate on solutions together
- **Cross-Platform Sync**: Desktop extension → Web → Mobile (coming soon)

### 📦 Lightweight Integration
- **Zero Configuration**: Works out of the box
- **Privacy First**: Local AI processing, optional cloud features
- **Performance Optimized**: Minimal impact on VS Code performance

## 🛠️ Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "TeamAI"
4. Click Install

### Manual Installation
1. Download the latest `.vsix` file from [Releases](https://github.com/jamesadewara/TeamAI-vsix/releases)
2. Open VS Code
3. Run command: `Extensions: Install from VSIX...`
4. Select the downloaded file

## 🚀 Quick Start

### 1. Open TeamAI
- **Command Palette**: `Ctrl+Shift+P` → "Open TeamAI Panel"
- **Keyboard Shortcut**: `Ctrl+Shift+T` (Windows/Linux) or `Cmd+Shift+T` (Mac)
- **Activity Bar**: Click the TeamAI robot icon

### 2. Configure Your Role
1. Open VS Code Settings (`Ctrl+,`)
2. Search for "TeamAI"
3. Set your development role (frontend, backend, fullstack, PM, designer, QA)

### 3. Start Collaborating
- Ask AI questions about your code: `Ctrl+Shift+A`
- Right-click selected code → "Ask TeamAI"
- Use the sidebar for ongoing conversations

## ⚙️ Configuration

### Settings
| Setting | Description | Default |
|---------|-------------|---------|
| `teamai.backendUrl` | Backend API URL | `http://localhost:8000` |
| `teamai.aiModel` | AI model to use | `deepseek-6b` |
| `teamai.enableRealTimeSync` | Enable collaboration sync | `true` |
| `teamai.userRole` | Your development role | `fullstack` |

### Available Commands
| Command | Shortcut | Description |
|---------|----------|-------------|
| `TeamAI: Open Panel` | `Ctrl+Shift+T` | Open main TeamAI interface |
| `TeamAI: Ask AI Assistant` | `Ctrl+Shift+A` | Ask AI about selected code |
| `TeamAI: Start Collaboration` | - | Begin team session |

## 🏗️ Architecture

```
TeamAI Extension
├── 🎯 VS Code Extension (TypeScript)
│   ├── Commands & Menus
│   ├── Webview Management
│   └── Settings Integration
├── ⚛️ React Frontend (Vite)
│   ├── AI Chat Interface
│   ├── Collaboration Tools
│   └── Role-Specific Views
└── 🔌 Backend Integration
    ├── Django REST API
    ├── Ollama AI Models
    └── Real-time WebSocket
```

## 🧠 AI Models Supported

### Current
- **Ollama DeepSeek (6B)** - Local inference, privacy-focused
- **Custom fine-tuned models** - Coming soon

### Planned
- **GPT-4/Claude-3** - Cloud-hosted options
- **Specialized coding models** - CodeLlama, StarCoder
- **Multi-modal AI** - Image/diagram understanding

## 🛠️ Tech Stack

### Extension Core
- **TypeScript** - Extension logic and VS Code API integration
- **Node.js** - Runtime environment
- **VS Code API** - Native integration

### Frontend Webview
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend (Separate Repository)
- **Django + DRF** - Robust Python web framework
- **Ollama** - Local AI model hosting
- **WebSocket** - Real-time communication
- **PostgreSQL** - Database (production)

## 🚧 Development Status

### ✅ Completed Features
- [x] VS Code extension framework
- [x] AI chat interface with DeepSeek integration
- [x] Role-based user configuration
- [x] Basic collaboration tools
- [x] Local AI inference setup
- [x] Real-time webview integration

### 🚧 In Progress
- [ ] Cloud AI model integration
- [ ] Advanced team collaboration features
- [ ] Performance optimizations
- [ ] Comprehensive testing suite

### 🔮 Future Roadmap
- [ ] **Web Application** - Full-featured browser version
- [ ] **Mobile Apps** - iOS and Android collaboration
- [ ] **Enterprise Features** - SSO, admin controls, analytics
- [ ] **Advanced AI** - Code generation, automated testing
- [ ] **Integrations** - GitHub, Jira, Slack, Discord

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/jamesadewara/TeamAI-vsix.git
cd TeamAI-vsix

# Install dependencies
npm install
cd webview && npm install && cd ..

# Start development
npm run dev

# Build and package
npm run package
```

## 🆘 Support & Feedback

### Getting Help
- 📖 [Documentation](https://github.com/jamesadewara/TeamAI-vsix/wiki)
- 🐛 [Report Bugs](https://github.com/jamesadewara/TeamAI-vsix/issues)
- 💡 [Feature Requests](https://github.com/jamesadewara/TeamAI-vsix/discussions)
- 📧 Email: james@teamai.dev

### Community
- 🔗 [GitHub Discussions](https://github.com/jamesadewara/TeamAI-vsix/discussions)
- 🐦 [Twitter Updates](https://twitter.com/jamesadewara)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama Team** - For making local AI accessible
- **VS Code Team** - For the excellent extension API
- **Open Source Community** - For the amazing tools and libraries

## 🎯 Vision

TeamAI is more than just a coding assistant — it's a step toward **seamless AI-augmented teamwork** for developers. Our goal is to create an ecosystem where:

- **AI understands your project context** and provides relevant assistance
- **Teams collaborate effortlessly** across different tools and platforms  
- **Knowledge is shared automatically** through intelligent suggestions
- **Productivity increases** without sacrificing code quality

---

<div align="center">

**Made with ❤️ by James Ayomide Adewara**

[⭐ Star on GitHub](https://github.com/jamesadewara/TeamAI-vsix) | [🚀 Check me on Linkedin Extension](https://www.linkedin.com/in/james-adewara-b0b955290) | [📽️ Watch Demo](https://youtube.com/shorts/QO66oRWXo-A)
</div>