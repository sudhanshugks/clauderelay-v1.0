// ← FILL THIS IN after Phase 2 (Step 13)
const WORKER_URL = 'https://clauderelay.ksudhanshugollu2001.workers.dev';

chrome.runtime.onMessage.addListener((msg, _, res) => {
    if (msg.type === 'SAVE_SNAPSHOT') { save(msg.data).then(res); return true; }
    if (msg.type === 'GET_LOCAL') { getLocal().then(res); return true; }
    if (msg.type === 'FETCH_BY_CODE') { fetchCode(msg.code).then(res); return true; }
    if (msg.type === 'CLEAR') { chrome.storage.local.clear(); res({ ok: true }); }
});

async function save(messages) {
    const snap = {
        memo: pack(messages),
        timestamp: Date.now(),
        messageCount: messages.length,
        preview: messages.at(-1)?.content?.slice(0, 150) ?? ''
    };
    await chrome.storage.local.set({ snap });

    // Skip cloud if worker URL not configured yet
    if (!WORKER_URL || WORKER_URL === 'YOUR_WORKER_URL_HERE') {
        return { code: null };
    }

    try {
        const r = await fetch(`${WORKER_URL}/relay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snap)
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const { code } = await r.json();
        await chrome.storage.local.set({ code });
        return { code };
    } catch (e) {
        console.warn('[ClaudeRelay] Cloud sync failed, saved locally:', e.message);
        return { code: null };
    }
}

async function getLocal() {
    const r = await chrome.storage.local.get(['snap', 'code']);
    return r.snap ? { ...r.snap, code: r.code } : null;
}

async function fetchCode(code) {
    if (!WORKER_URL || WORKER_URL === 'YOUR_WORKER_URL_HERE') return null;
    try {
        const r = await fetch(`${WORKER_URL}/relay/${code}`);
        return r.ok ? r.json() : null;
    } catch { return null; }
}

function pack(msgs) {
    const recent = msgs.slice(-20);
    const skip = msgs.length - recent.length;
    return (skip > 0 ? `[${skip} earlier messages omitted]\n\n` : '')
        + recent.map(m => `${m.role === 'user' ? 'Human' : 'Claude'}: ${m.content}`).join('\n\n');
}