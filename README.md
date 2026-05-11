# 🔁 ClaudeRelay (v1.0.0 - 1st Version)

Seamless Claude account handoff. When you hit the free usage limit, ClaudeRelay saves your conversation so you can continue it instantly on another account — one click, no lost context.

> **Note:** We are currently working on an exciting new feature that will be included in the next version. Keep using the extension and stay tuned for updates!

## ✨ Features

- ✅ Auto-saves when a Claude usage limit is detected.
- ✅ One-click save from the extension popup (no DevTools needed).
- ✅ Cross-browser sync via Cloudflare KV (free).
- ✅ Works on Chrome, Edge, and Brave (any Chromium-based browser).
- ✅ 100% free for users — open source.

## 📥 Install

[Chrome Web Store link] | [Edge Add-ons link] | [Firefox Add-ons link]

### Developer / Manual Installation
1. Clone or download the project files.
2. Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/` / `brave://extensions/`).
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the `extension` folder located inside the project directory.

## 🚀 How It Works

1. Use Claude normally.
2. When you hit the limit, ClaudeRelay auto-saves your chat (or click 💾 in the extension popup anytime).
3. Switch to another Claude account (in the same or a new browser).
4. "▶ Continue chat" appears in the sidebar — click it.
5. Claude continues from exactly where you left off.
6. This process can be repeated any number of times to continue the conversation across different accounts.

## ⭐ 5 Important Highlights

1. **Smart Context Packing:** It intelligently packs your conversation by sending the last 20 messages to ensure Claude retains the most relevant recent context while saving space.
2. **Cross-Browser Sync (Cloudflare Worker):** Includes support for syncing over a Cloudflare worker backend (`https://clauderelay.ksudhanshugollu2001.workers.dev`), letting you safely pass a short Relay Code to another device or browser.
3. **Robust Local Fallback:** Even if cloud sync fails or is unavailable, the extension saves the conversation snapshot locally (using `chrome.storage.local`), allowing you to switch accounts on the same browser effortlessly.
4. **Native-Feeling UI Integration:** The UI changes, including toast notifications and sidebar injections (`injector.js`), are designed to look and feel completely native to the original Claude.ai interface.
5. **Privacy First & Ephemeral Storage:** Your data is only saved when explicitly triggered (either manually or by hitting a limit) and your cloud sync Relay Codes expire securely after 4 hours.

## 📁 Core Architecture

- `manifest.json`: The core Chrome extension manifest utilizing modern Manifest V3 standards.
- `background.js`: Service worker managing local storage operations and Cloudflare network synchronization.
- `content.js`: Observes the DOM to scrape conversation history and detect usage limit banners automatically.
- `injector.js`: Responsible for safely injecting the "Continue chat" sidebar UI elements and auto-filling the resumed prompt.
- `popup/`: The minimalist dark-themed HTML/CSS/JS frontend for the extension's toolbar popup.

## 📄 License & Versioning

**Version:** 1.0.0 (1st Version of ClaudeRelay)

**Proprietary License**
All rights reserved. This project and its contents are proprietary. No part of this software may be copied, distributed, or modified without explicit permission from the author. 

If you wish to become a contributor, suggest edits, or request updates, please send a direct request.

## 📦 Releases

- **v1.0.0 (Latest):** Initial release of ClaudeRelay featuring cross-browser sync, local fallback, and smart context packing.
