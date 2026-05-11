<div align="center">

# ClaudeRelay (v1.0.0)

Seamless Claude account handoff. When you hit the free usage limit, ClaudeRelay saves your conversation so you can continue it instantly on another account — one click, no lost context.

</div>

---

## The Problem
You are mid-conversation. Claude is helping you build something, debug something, or research something. Then:

> *"You've reached your usage limit. Please try again later."*

Your context is gone. Switching to a second account means starting over — re-explaining the project, the constraints, the progress so far. Every time.

## The Solution
ClaudeSync saves your session before you switch. Open your next account, read your context in the sidebar, and continue naturally. No re-explaining. No lost progress.

## Why zero tokens?
Most tools that claim to "sync context" inject saved text directly into the Claude chat input. That means Claude reads it, which consumes input tokens — and you hit your limit even faster.

ClaudeSync shows your context in a **sidebar panel beside the chat**. You read it. Nothing extra is sent to Claude. Zero tokens are used, ever.

---

## Features
- ✅ Auto-saves when Claude usage limit is detected
- ✅ One-click save from extension popup (no DevTools needed)
- ✅ Cross-browser sync via Cloudflare KV (free)
- ✅ Works on Chrome, Edge, and Brave (any browser)
- ✅ 100% free for users — open source


## Installation
### Option A — Chrome Web Store *(coming soon)*

### Option B — Manual install (Developer Mode)
1. [Download the latest release](../../releases/latest) and unzip it
2. Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/` / `brave://extensions/`).
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the `extension` folder located inside the project directory.
5. The ClaudeSync icon appears in your toolbar

## How It Works

1. Use Claude normally.
2. When you hit the limit, ClaudeRelay auto-saves your chat (or click 💾 in the extension popup anytime).
3. Switch to another Claude account in any browser (same browser or new browser).
4. "▶ Continue chat" appears in the sidebar — click it.
5. Claude continues from exactly where you left off.
6. Repeat with Account 3, Account 4 — as many times as needed.

## 5 Important Highlights

1. **- The extension only runs on `claude.ai`.
2. **Smart Context Packing:** It intelligently packs your conversation by sending the last 15+ messages to ensure Claude retains the most relevant recent context while saving space.
3. **Cross-Browser Sync (Cloudflare Worker):** Includes support for syncing over a Cloudflare worker backend, letting you safely pass a short Relay Code to another device or browser.
4. **Robust Local Fallback:** Even if cloud sync fails or is unavailable, the extension saves the conversation snapshot locally (using `chrome.storage.local`), allowing you to switch accounts on the same browser effortlessly.
5. **Native-Feeling UI Integration:** The UI changes, including toast notifications and sidebar injections (`injector.js`), are designed to look and feel completely native to the original Claude.ai interface.
6. **Privacy First & Ephemeral Storage:** Your data is only saved when explicitly triggered (either manually or by hitting a limit) and your cloud sync Relay Codes expire securely after 4 hours.

## Core Architecture

- `manifest.json`: The core Chrome extension manifest utilizing modern Manifest V3 standards.
- `background.js`: Service worker managing local storage operations and Cloudflare network synchronization.
- `content.js`: Observes the DOM to scrape conversation history and detect usage limit banners automatically.
- `injector.js`: Responsible for safely injecting the "Continue chat" sidebar UI elements and auto-filling the resumed prompt.
- `popup/`: The minimalist dark-themed HTML/CSS/JS frontend for the extension's toolbar popup.


## License & Versioning

**Proprietary License**
All rights reserved. This project and its contents are proprietary. No part of this software may be copied, distributed, or modified without explicit permission from the author. 

If you wish to become a contributor, suggest edits, or request updates, please send a direct request.

Ways to help:
- Star the repo to help others find it
- [Report bugs](../../issues/new)
- [Suggest features](../../issues/new)
- Open a pull request

Ideas for future versions:
-  Firefox add-on listing
-  Select which sessions to sync (checkboxes in sidebar)
-  One-click "open new chat and continue" button
-  Export all saved data as Markdown

---

## 📦 Releases

- **v1.0.0 (Latest):** Initial release of ClaudeRelay featuring cross-browser sync, local fallback, and smart context packing.

> **Note:** We are currently working on an exciting new feature that will be included in the next version. Keep using the extension and stay tuned for updates!

<div align="center">
If ClaudeRelay saved your conversation today, give it a ⭐
</div>
