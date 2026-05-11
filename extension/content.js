// ── Scrape conversation from DOM ───────────────────────────────────────
function scrapeConversation() {
    const messages = [];
    document.querySelectorAll('.font-claude-response, [class*="font-user-message"]').forEach(el => {
        const isUser = el.className.includes('font-user-message');
        const content = el.innerText.trim();
        if (content.length > 0) {
            messages.push({ role: isUser ? 'user' : 'assistant', content });
        }
    });
    return messages;
}

// ── Toast notification ─────────────────────────────────────────────────
function toast(msg, color = '#3dd68c') {
    document.getElementById('cr-toast')?.remove();
    const el = document.createElement('div');
    el.id = 'cr-toast';
    el.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:99999;
  background:#13131a;color:${color};border:1px solid ${color}40;
  padding:12px 20px;border-radius:10px;font-size:14px;
  font-family:system-ui;box-shadow:0 8px 30px rgba(0,0,0,.5);
  max-width:320px;line-height:1.5;pointer-events:none;`;
    el.innerText = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

// ── Auto-save when usage limit is detected ─────────────────────────────
let _saved = false;
const obs = new MutationObserver(() => {
    if (_saved) return;
    const txt = document.body.innerText.toLowerCase();
    const hit = [
        "you've reached your usage limit",
        "you've hit the limit",
        "message limit reached",
        "usage limit",
        "reached the free plan limit",
        "out of messages",
        "try again tomorrow"
    ].some(p => txt.includes(p));

    if (!hit) return;
    _saved = true;
    const msgs = scrapeConversation();
    if (msgs.length === 0) { _saved = false; return; }

    chrome.runtime.sendMessage({ type: 'SAVE_SNAPSHOT', data: msgs }, res => {
        if (res?.code) {
            toast(`🔁 ClaudeRelay saved!\nRelay code: ${res.code}\nSwitch accounts — look for it in the sidebar.`);
        } else {
            toast('🔁 ClaudeRelay saved locally!\nSwitch accounts — context is ready.');
        }
    });
});
obs.observe(document.body, { childList: true, subtree: true });

// ── Listen for save trigger from popup button ──────────────────────────
chrome.runtime.onMessage.addListener((msg, _, res) => {
    if (msg.type === 'TRIGGER_SAVE') {
        const msgs = scrapeConversation();
        if (msgs.length === 0) {
            res({ ok: false, reason: 'no_messages' });
            return true;
        }
        chrome.runtime.sendMessage({ type: 'SAVE_SNAPSHOT', data: msgs }, r => {
            res({ ok: true, code: r?.code ?? null });
        });
        return true;
    }
});

// ── Manual save still available for power users ────────────────────────
window.crSave = () => {
    const m = scrapeConversation();
    if (m.length === 0) { toast('No messages found.', '#f05a5a'); return; }
    chrome.runtime.sendMessage({ type: 'SAVE_SNAPSHOT', data: m }, r =>
        toast(`✅ Saved ${m.length} messages. Code: ${r?.code ?? 'local only'}`)
    );
};