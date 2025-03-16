# Clipboard History

A simple clipboard history manager that allows you to save and access your recent clipboard items.

![Clipboard History App Screenshot](https://via.placeholder.com/800x450?text=Clipboard+History+App)

## Features

- 📋 Save text items from your clipboard
- 📜 View your clipboard history
- 🔄 Access your clipboard history via REST API
- 🔍 Retrieve specific clipboard items by index
- 🗑️ Clear clipboard history when needed
- 💾 Persistent storage between sessions

## Getting Started

### Prerequisites

- [Deno](https://deno.com/) runtime (version 1.34.0 or later)

### Usage

- Run directly
   ```
   deno -A  https://github.com/sigmaSd/clipboard-history/raw/refs/heads/master/src/webview.ts
   ```

- Install as script
   ```
   deno install --global --name cliphist -A  https://github.com/sigmaSd/clipboard-history/raw/refs/heads/master/src/webview.ts
   ```

- Compile as a standalone binary
   ```
   deno compile -A --include https://github.com/sigmaSd/clipboard-history/raw/refs/heads/master/src/server.ts  https://github.com/sigmaSd/clipboard-history/raw/refs/heads/master/src/webview.ts
   ```

### Usage

1. The application will open in a new window.
2. Copy any text using your standard copy command (Ctrl+C/Cmd+C).
3. Paste the text into the application window (Ctrl+V/Cmd+V).
4. Your clipboard history will be displayed, with the most recent items at the top.
5. Use the "Clear History" button to delete all history items.

## API Endpoints

The application provides a REST API for working with clipboard history:

- `GET http://localhost:8485/get?index=0` - Get clipboard item by index (newest first)
- `GET http://localhost:8485/getAll` - Get all clipboard history items
- `POST http://localhost:8485/add` - Add new item to clipboard history (with JSON body containing `text` property)
- `POST http://localhost:8485/clear` - Clear all clipboard history

The get endpoints can also output the clipboard item as JSON with `json` parameter:

- `GET http://localhost:8485/get?index=0&json` - Get clipboard item by index (newest first) as JSON
- `GET http://localhost:8485/getAll?json` - Get all clipboard history items as JSON

## Tech Stack

- [Deno](https://deno.com/) - JavaScript/TypeScript runtime
- [Oak](https://jsr.io/@oak/oak) - HTTP server framework for Deno
- [WebView](https://jsr.io/@webview/webview) - Native WebView library for Deno
- HTML/CSS/JavaScript - Frontend UI

## Project Structure

- `paste/src/webview.ts` - Main entry point for the desktop application
- `paste/src/server.ts` - HTTP server for API endpoints
- `paste/src/index.html` - User interface

## License

This project is licensed under the MIT License - see the LICENSE file for details.
