document.addEventListener('DOMContentLoaded', async () => {

    // ── Load existing snapshot on open ────────────────────────────────
    const snap = await chrome.runtime.sendMessage({ type: 'GET_LOCAL' });
    if (snap) {
        const mins = Math.floor((Date.now() - snap.timestamp) / 60000);
        const ago = mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
        document.getElementById('empty').style.display = 'none';
        document.getElementById('snap-card').style.display = 'block';
        document.getElementById('info').textContent = `✅ ${snap.messageCount} messages · ${ago}`;
        document.getElementById('prev').textContent = (snap.preview || '') + '…';
        if (snap.code) {
            document.getElementById('code-card').style.display = 'block';
            document.getElementById('code').textContent = snap.code;
        }
    }

    // ── 💾 Save Current Chat button ───────────────────────────────────
    document.getElementById('save-now').onclick = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.url?.includes('claude.ai')) {
            alert('Please open a Claude.ai chat tab first, then click Save.');
            return;
        }
        const btn = document.getElementById('save-now');
        btn.textContent = '⏳ Saving...';
        btn.disabled = true;

        try {
            const result = await chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_SAVE' });
            if (result?.ok) {
                const codeText = result.code
                    ? ` Code: ${result.code}`
                    : ' (local — set up Cloudflare for relay codes)';
                btn.textContent = `✅ Saved!${codeText}`;
                btn.style.background = '#1a5c3a';
                setTimeout(() => window.close(), 1000);
            } else {
                const msg = result?.reason === 'no_messages'
                    ? '❌ No messages yet — have a conversation first'
                    : '❌ Failed — refresh claude.ai and try again';
                btn.textContent = msg;
                btn.style.background = '#5c1a1a';
                btn.disabled = false;
                setTimeout(() => {
                    btn.textContent = '💾 Save Current Chat';
                    btn.style.background = '#7c6ef7';
                }, 3000);
            }
        } catch (e) {
            btn.textContent = '❌ Reload extension + refresh claude.ai';
            btn.style.background = '#5c1a1a';
            btn.disabled = false;
            setTimeout(() => {
                btn.textContent = '💾 Save Current Chat';
                btn.style.background = '#7c6ef7';
                btn.disabled = false;
            }, 3000);
        }
    };

    // ── Load context from relay code ──────────────────────────────────
    document.getElementById('load').onclick = async () => {
        let c = document.getElementById('code-in').value.trim().toUpperCase();
        if (!c.startsWith('CR-')) c = 'CR-' + c;
        if (c.length < 7) { alert('Enter a valid code like CR-4829'); return; }
        const s = await chrome.runtime.sendMessage({ type: 'FETCH_BY_CODE', code: c });
        if (!s) { alert('Code not found or expired (codes last 4 hours)'); return; }
        await chrome.storage.local.set({ snap: s, code: c });
        alert('✅ Loaded! Go to claude.ai — look for "▶ Continue chat" in the sidebar.');
        window.close();
    };

    // ── Clear snapshot ────────────────────────────────────────────────
    document.getElementById('clr').onclick = async () => {
        await chrome.runtime.sendMessage({ type: 'CLEAR' });
        document.getElementById('empty').style.display = 'block';
        ['snap-card', 'code-card'].forEach(id =>
            document.getElementById(id).style.display = 'none'
        );
    };
});