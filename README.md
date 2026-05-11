<br/><br/>

# ClaudeRelay

**Hit the Claude usage limit? Don't lose your conversation.**

ClaudeRelay saves your chat with one click and lets you pick up exactly where you left off — on any account, any browser.

[⭐ Star to Unlock](#) · [🐛 Report a Bug](../../issues) · [💡 Request a Feature](../../issues)

</div>

---

## 😤 The Problem

You're in the middle of a deep conversation with Claude. Then — **boom.**

> *"You've reached your usage limit. Try again after [painful wait time]."*

You lose your flow. Your context is gone. Starting over means re-explaining everything from scratch.

## ✨ The Solution

ClaudeRelay auto-saves your conversation the moment it detects the limit. Switch to another Claude account and **continue in seconds** — not from scratch, but from exactly where you left off.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 **Auto-detection** | Spots the usage limit banner automatically and saves your chat instantly |
| 💾 **One-click save** | Hit the save button in the popup anytime — don't wait for the limit |
| ☁️ **Cross-browser sync** | Uses Cloudflare KV to pass a short Relay Code to any device or browser |
| 📦 **Local fallback** | Even without internet, saves locally so same-browser switching always works |
| 🎨 **Native UI** | Toast notifications and sidebar inject cleanly into Claude's own design |
| 🔒 **Privacy first** | Nothing is saved until you trigger it. Cloud codes expire in 4 hours |
| 🆓 **100% free** | No subscriptions, no paywalls, no tracking |

---

## ⚡ How It Works

```
1. Use Claude normally
        ↓
2. Hit the limit (or click 💾 anytime to save early)
        ↓
3. Get a short Relay Code
        ↓
4. Open Claude on another account — same or different browser
        ↓
5. Click "▶ Continue chat" in the sidebar
        ↓
6. Claude picks up right where you left off ✅
```

Repeat as many times as you need across as many accounts as you have.

---

## 📥 Installation

### Option A — Browser Web Stores *(coming soon)*

> Chrome Web Store · Edge Add-ons · Firefox Add-ons

### Option B — Manual Install (Developer Mode)

> Works on **Chrome**, **Edge**, and **Brave**

1. Clone or download this repo
2. Open your browser and go to `chrome://extensions/` (or `edge://extensions/` / `brave://extensions/`)
3. Toggle **Developer mode** on (top-right corner)
4. Click **Load unpacked** → select the `extension/` folder inside this project
5. The 🔁 icon appears in your toolbar — you're ready!

> **First launch:** You'll be asked to ⭐ star this repo to unlock the extension. It takes 2 seconds and keeps this project alive!

---

## 🧠 Under the Hood

ClaudeRelay is built with **smart context packing** — it doesn't dump your entire chat history, it intelligently selects the last 15+ most relevant messages to keep Claude's context tight and coherent when resuming.

### Core files

```
extension/
├── manifest.json     → Manifest V3 extension config
├── background.js     → Service worker: storage + Cloudflare sync
├── content.js        → DOM observer: scrapes chat + detects limit banners
├── injector.js       → Injects "Continue chat" sidebar UI + auto-fills prompt
├── gate/
│   ├── gate.html     → Star gate unlock page (first install)
│   └── gate.js       → GitHub star verification
└── popup/
    ├── popup.html    → Toolbar popup UI
    └── popup.js      → Popup logic: save, relay code, status
```

### Cloud sync (optional)

Cross-browser relay runs through a **Cloudflare Worker + KV** backend — free tier, zero cost to you or us. Your conversation snapshot is stored ephemerally under a short code and **auto-deleted after 4 hours**. No accounts, no databases, no data retention.

---

## 🔧 Deploy Your Own Backend

Want full control? You can self-host the Cloudflare Worker:

1. Sign up at [cloudflare.com](https://cloudflare.com) (free tier is more than enough)
2. Create a **KV namespace** called `RELAY_STORE`
3. Deploy the worker from `/worker/` in this repo
4. Update `WORKER_URL` in `background.js` to point to your worker

Full setup guide → [`/docs/deploy.md`](./docs/deploy.md) *(coming soon)*

---

## 🛡️ Privacy & Security

We built ClaudeRelay with privacy as a first principle, not an afterthought:

- ✅ **No account required** — ever
- ✅ **No analytics, no tracking, no telemetry**
- ✅ **Data is only saved when you trigger it** (manually or at limit)
- ✅ **Cloud sync codes expire automatically** after 4 hours
- ✅ **Local fallback never leaves your device**
- ✅ **Open source** — you can read every line of code

The extension only requests permissions it actually needs. See [`manifest.json`](./extension/manifest.json) for the full list.

---

## 🤝 Contributing

ClaudeRelay is source-available but proprietary. Direct code contributions aren't open at the moment, but you can absolutely help by:

- ⭐ **Starring the repo** (it's literally step one!)
- 🐛 [Reporting bugs](../../issues/new?template=bug_report.md)
- 💡 [Suggesting features](../../issues/new?template=feature_request.md)
- 📣 Sharing with others who hit Claude's limit

Want to contribute code? Send a message and we'll talk.

---

## 📦 Changelog

### v1.0.0 — *Initial Release*
- ✅ Auto-detection of Claude usage limit banner
- ✅ One-click conversation save from popup
- ✅ Cloudflare KV cross-browser relay
- ✅ Local storage fallback
- ✅ Native sidebar "Continue chat" injector
- ✅ Toast notification system
- ✅ Star gate unlock system

> 🔜 **Something new is cooking for v1.1.0.** Star the repo to stay updated.

---

## 📄 License

**Proprietary — All Rights Reserved**

This project is free to use but not free to copy, redistribute, or modify without explicit permission. See [`LICENSE`](./LICENSE) for full terms.

---

<div align="center">

Made with ☕ and frustration at usage limits.

**If ClaudeRelay saved your conversation today, give it a ⭐**

</div>
