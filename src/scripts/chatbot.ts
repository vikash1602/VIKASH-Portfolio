/* ===========================================================================
   FOLIO client controller — one shared conversation state, two interfaces.
   Every [data-chat-root] (floating widget + dedicated section) renders the
   same message list from memory; nothing is persisted beyond the session.
   The browser only ever calls POST /api/chat — no keys, no provider calls.
   ======================================================================== */

import { SUGGESTED_QUESTIONS, WELCOME_MESSAGE } from '../data/chatbotKnowledge';

declare global {
  interface Window {
    __folioReady?: boolean;
  }
}

interface Msg {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

const MAX_MESSAGE_CHARS = 800;
const MAX_HISTORY_TURN_MESSAGES = 12; // last 6 turns

const state = {
  messages: [] as Msg[],
  busy: false,
  failedUserMessage: null as string | null,
};

const roots = new Set<HTMLElement>();

/* ------------------------- tiny safe markdown ----------------------------- */

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const safeUrl = (url: string): string | null => {
  try {
    const u = new URL(url, location.origin);
    if (['http:', 'https:', 'mailto:'].includes(u.protocol)) return u.toString();
    return null;
  } catch {
    return null;
  }
};

function renderInline(text: string): string {
  let out = escapeHtml(text);
  // [label](url) — only safe protocols survive
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, url: string) => {
    const safe = safeUrl(url);
    return safe
      ? `<a href="${safe}" target="_blank" rel="noopener noreferrer" class="underline decoration-2 underline-offset-2">${label}</a>`
      : label;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/`([^`]+)`/g, '<code class="bg-black/10 px-1 rounded-none">$1</code>');
  // <https://…> autolinks
  out = out.replace(/&lt;(https?:\/\/[^&\s]+)&gt;/g, (_, url: string) => {
    const safe = safeUrl(url);
    return safe
      ? `<a href="${safe}" target="_blank" rel="noopener noreferrer" class="underline decoration-2 underline-offset-2 break-all">${safe.replace(/^https?:\/\//, '')}</a>`
      : _;
  });
  // bare URLs
  out = out.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_, pre: string, url: string) => {
    const safe = safeUrl(url);
    return safe
      ? `${pre}<a href="${safe}" target="_blank" rel="noopener noreferrer" class="underline decoration-2 underline-offset-2 break-all">${url.replace(/^https?:\/\//, '')}</a>`
      : `${pre}${url}`;
  });
  return out;
}

/** Blocks: paragraphs, bullet lists, numbered lists. No raw HTML ever passes. */
function renderMarkdown(text: string): string {
  const lines = text.split(/\r?\n/);
  const html: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (list) {
      const tag = list.type;
      html.push(`<${tag} class="${tag === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 space-y-1">${list.items.map((i) => `<li>${renderInline(i)}</li>`).join('')}</${tag}>`);
      list = null;
    }
  };

  for (const line of lines) {
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (bullet) {
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(bullet[1]);
    } else if (numbered) {
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(numbered[1]);
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      html.push(`<p>${renderInline(line)}</p>`);
    }
  }
  flushList();
  return html.join('');
}

/* --------------------------- mascot mood bridge --------------------------- */

type Mood = 'idle' | 'thinking' | 'talking' | 'happy' | 'error';
let moodTimer: ReturnType<typeof setTimeout> | undefined;

/** Push a mood to every mounted FOLIO-01 mascot (src/components/FolioMascot.astro). */
function setMood(mood: Mood, revertAfterMs?: number) {
  clearTimeout(moodTimer);
  document.querySelectorAll<HTMLElement>('[data-folio-mascot]').forEach((el) => {
    el.dataset.mood = mood;
  });
  if (revertAfterMs) {
    moodTimer = setTimeout(() => setMood('idle'), revertAfterMs);
  }
}

/* ------------------------------- rendering -------------------------------- */

function isNearBottom(el: HTMLElement): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
}

function bubbleFor(msg: Msg): string {
  if (msg.role === 'user') {
    return `<div class="flex justify-end"><div class="max-w-[85%] border-2 border-neo-black bg-neo-black px-3 py-2 text-sm text-white whitespace-pre-wrap break-words">${escapeHtml(msg.content)}</div></div>`;
  }
  const base = 'max-w-[90%] border-2 border-neo-black bg-white px-3 py-2 text-sm space-y-2 break-words';
  if (msg.isError) {
    return `<div class="flex justify-start"><div class="${base} border-neo-red bg-white text-neo-red" role="status">${renderMarkdown(msg.content)}${
      state.failedUserMessage
        ? `<button type="button" class="chat-retry sticker mt-1 bg-neo-yellow px-2 py-1 text-xs font-bold" data-chat-retry>RETRY_MSG</button>`
        : ''
    }</div></div>`;
  }
  return `<div class="flex justify-start"><div class="${base}">${renderMarkdown(msg.content)}</div></div>`;
}

function render(root: HTMLElement) {
  const log = root.querySelector<HTMLElement>('[data-chat-log]');
  if (!log) return;
  const stick = isNearBottom(log);
  const typing = state.busy
    ? `<div class="flex justify-start"><div class="chat-typing border-2 border-neo-black bg-white px-3 py-3" aria-label="Folio is typing"><span></span><span></span><span></span></div></div>`
    : '';
  log.innerHTML = state.messages.map(bubbleFor).join('') + typing;
  if (stick) log.scrollTop = log.scrollHeight;

  const send = root.querySelector<HTMLButtonElement>('[data-chat-send]');
  if (send) send.disabled = state.busy;
  const input = root.querySelector<HTMLTextAreaElement>('[data-chat-input]');
  if (input) input.disabled = state.busy;
}

function renderAll() {
  for (const root of roots) render(root);
}

/* ------------------------------- the API ---------------------------------- */

async function ask(text: string) {
  if (state.busy || !text.trim()) return;
  state.failedUserMessage = null;
  state.messages.push({ role: 'user', content: text.trim().slice(0, MAX_MESSAGE_CHARS) });
  state.busy = true;
  setMood('thinking');
  renderAll();

  const history = state.messages
    .filter((m) => !m.isError)
    .slice(-MAX_HISTORY_TURN_MESSAGES - 1, -1)
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text.trim().slice(0, MAX_MESSAGE_CHARS), history }),
    });
    const data = (await res.json()) as { reply?: string; error?: string };

    if (res.ok && data.reply) {
      state.messages.push({ role: 'assistant', content: data.reply });
      setMood('talking', 2600); // mouth animates while the answer renders
    } else {
      state.failedUserMessage = text.trim();
      state.messages.push({
        role: 'assistant',
        isError: true,
        content: data.error ?? 'Folio could not answer right now — please try again.',
      });
      setMood('error'); // stays concerned until the next send
    }
  } catch {
    state.failedUserMessage = text.trim();
    state.messages.push({
      role: 'assistant',
      isError: true,
      content: 'Network glitch — Folio could not reach the server. Check your connection and retry.',
    });
    setMood('error');
  } finally {
    state.busy = false;
    renderAll();
  }
}

/* ------------------------------- mounting --------------------------------- */

function mount(root: HTMLElement) {
  roots.add(root);

  // Seed the shared welcome once (local — never an API call).
  if (state.messages.length === 0) {
    state.messages.push({ role: 'assistant', content: WELCOME_MESSAGE });
  }

  const log = root.querySelector<HTMLElement>('[data-chat-log]')!;
  const form = root.querySelector<HTMLFormElement>('[data-chat-form]')!;
  const input = root.querySelector<HTMLTextAreaElement>('[data-chat-input]')!;
  const send = root.querySelector<HTMLButtonElement>('[data-chat-send]')!;
  const clear = root.querySelector<HTMLButtonElement>('[data-chat-clear]')!;
  const count = root.querySelector<HTMLElement>('[data-chat-count]')!;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    if (!text.trim() || state.busy) return;
    input.value = '';
    updateCount();
    input.focus();
    void ask(text);
  });

  // Enter sends; Shift+Enter adds a newline.
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  const updateCount = () => {
    count.textContent = `${input.value.length}/${MAX_MESSAGE_CHARS}`;
  };
  input.addEventListener('input', () => {
    updateCount();
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 96)}px`;
  });

  clear.addEventListener('click', () => {
    state.messages = [{ role: 'assistant', content: WELCOME_MESSAGE }];
    state.failedUserMessage = null;
    state.busy = false;
    setMood('happy', 1800); // a little bounce before returning to idle
    renderAll();
  });

  // Suggested questions (server-rendered chips) + delegated retry buttons.
  root.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest<HTMLElement>('[data-chat-chip]');
    if (chip && !state.busy) {
      void ask(chip.textContent ?? '');
      return;
    }
    const retry = (e.target as HTMLElement).closest<HTMLElement>('[data-chat-retry]');
    if (retry && state.failedUserMessage) {
      const msg = state.failedUserMessage;
      // drop the error bubble, resend
      const lastErr = [...state.messages].reverse().find((m) => m.isError);
      if (lastErr) state.messages.splice(state.messages.indexOf(lastErr), 1);
      void ask(msg);
    }
  });

  render(root);
}

export function initChatbot() {
  document.querySelectorAll<HTMLElement>('[data-chat-root]').forEach(mount);

  // First visit: let Folio-01 introduce himself once (desktop + mobile),
  // then settle back into his idle float.
  setTimeout(() => {
    const mascot = document.querySelector<HTMLElement>('[data-folio-mascot]');
    if (!mascot || sessionStorage.getItem('folio-introduced')) return;
    sessionStorage.setItem('folio-introduced', '1');
    mascot.dataset.autoBubble = '1';
    setMood('happy', 1500);
    setTimeout(() => {
      mascot.dataset.autoBubble = '0';
    }, 4600);
  }, 2600);

  // Floating widget open/close (shared with the always-visible section).
  const launcher = document.getElementById('chat-launcher');
  const panel = document.getElementById('chat-panel');
  if (launcher && panel) {
    window.__folioReady = true;
    // Honour a click that happened before the module was ready.
    if (launcher.hasAttribute('data-pending-open')) {
      launcher.removeAttribute('data-pending-open');
      if (panel.hidden) {
        panel.hidden = false;
        panel.classList.remove('hidden');
        panel.classList.add('is-open');
        launcher.setAttribute('aria-expanded', 'true');
        setTimeout(() => panel.querySelector<HTMLTextAreaElement>('[data-chat-input]')?.focus(), 0);
      }
    }
    const setOpen = (open: boolean) => {
      // The panel starts with the `hidden` HTML attribute — toggle it (and the
      // utility class) together so the UA stylesheet never keeps it invisible.
      panel.hidden = !open;
      panel.classList.toggle('hidden', !open);
      panel.classList.toggle('is-open', open); // "opening his workspace" pop
      launcher.setAttribute('aria-expanded', String(open));
      if (open) {
        panel.querySelector<HTMLTextAreaElement>('[data-chat-input]')?.focus();
        renderAll();
      } else {
        launcher.focus();
      }
    };
    launcher.addEventListener('click', () => setOpen(panel.classList.contains('hidden')));
    panel.querySelector<HTMLElement>('[data-chat-close]')?.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.classList.contains('hidden')) setOpen(false);
    });
  }
}

initChatbot();

export {};
