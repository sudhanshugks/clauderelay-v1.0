async function init() {
    checkPending();
    injectSidebar();
}

async function injectSidebar() {
    const snap = await chrome.runtime.sendMessage({ type: 'GET_LOCAL' });
    if (!snap) return;
    if (Date.now() - snap.timestamp > 14400000) return; // 4h expiry
    waitFor(
        () => document.querySelector(
            'nav ol, nav ul, [data-testid="conversations-list"], aside ol, [class*="ConversationList"]'
        ),
        list => addSidebarItem(list, snap)
    );
}

function addSidebarItem(list, snap) {
    if (document.getElementById('cr-item')) return;
    const mins = Math.floor((Date.now() - snap.timestamp) / 60000);
    const ago = mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;

    const li = document.createElement('li');
    li.id = 'cr-item';
    li.style.cssText = `
    list-style:none;margin:4px 8px 8px;border-radius:10px;
    background:rgba(124,110,247,.1);border:1px solid rgba(124,110,247,.25);
    cursor:pointer;position:relative;transition:background .15s;
  `;
    li.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;">
      <div style="width:5px;height:34px;background:#7c6ef7;border-radius:3px;flex-shrink:0"></div>
      <div style="flex:1;overflow:hidden;">
        <div style="font-size:13px;font-weight:600;color:inherit;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ▶ Continue chat
        </div>
        <div style="font-size:11px;opacity:.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">
          ${esc(snap.preview)}
        </div>
      </div>
      <span style="font-size:11px;color:#7c6ef7;font-weight:600;flex-shrink:0">${ago}</span>
    </div>
  `;

    li.onmouseenter = () => li.style.background = 'rgba(124,110,247,.18)';
    li.onmouseleave = () => li.style.background = 'rgba(124,110,247,.1)';
    li.onclick = () => startChat(snap);

    const x = document.createElement('button');
    x.innerText = '×';
    x.style.cssText = 'position:absolute;top:6px;right:8px;background:none;border:none;color:#888;cursor:pointer;font-size:16px;padding:0;line-height:1;';
    x.onclick = e => { e.stopPropagation(); li.remove(); };
    li.appendChild(x);

    list.insertBefore(li, list.firstChild);
}

function startChat(snap) {
    const prompt = buildPrompt(snap.memo);
    const isEmpty = document.querySelectorAll('[data-testid="human-turn"]').length === 0;
    if (isEmpty) { fillOnly(prompt); return; }

    sessionStorage.setItem('cr_prompt', prompt);
    sessionStorage.setItem('cr_ts', String(Date.now()));

    (document.querySelector('[data-testid="new-chat-button"]') ||
        document.querySelector('button[aria-label*="new" i]') ||
        document.querySelector('a[href="/"]')
    )?.click() ?? (window.location.href = '/');
}

function checkPending() {
    const prompt = sessionStorage.getItem('cr_prompt');
    const ts = Number(sessionStorage.getItem('cr_ts') || 0);
    if (!prompt || Date.now() - ts > 30000) return;
    sessionStorage.removeItem('cr_prompt');
    sessionStorage.removeItem('cr_ts');
    waitFor(
        () => document.querySelector('[contenteditable="true"], textarea'),
        el => { fill(el, prompt); } // fills only — user sends manually
    );
}

function fillOnly(text) {
    waitFor(
        () => document.querySelector('[contenteditable="true"], textarea'),
        el => { fill(el, text); } // fills only — user sends manually
    );
}

function fill(el, text) {
    el.focus();
    if (el.tagName === 'TEXTAREA') {
        const s = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        s?.call(el, text);
        el.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        document.execCommand('selectAll', false);
        document.execCommand('insertText', false, text);
    }
}

function buildPrompt(memo) {
    return `[ClaudeRelay — continuing from previous session]
You are continuing a conversation that was cut off when the last account hit its usage limit.
Here is the full conversation:

${memo}

---
Acknowledge you have the context in one short sentence, then continue naturally where we left off.`;
}

function waitFor(query, cb, tries = 0) {
    const el = query();
    if (el) { cb(el); return; }
    if (tries > 60) return;
    setTimeout(() => waitFor(query, cb, tries + 1), 200);
}

function esc(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.addEventListener('load', () => setTimeout(init, 2000));