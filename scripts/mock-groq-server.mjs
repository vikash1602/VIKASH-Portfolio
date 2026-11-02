/**
 * Mock Groq server for testing Folio's error paths without burning quota:
 *   node scripts/mock-groq-server.mjs [port]      (default 5179)
 *
 * Point the site at it with:  GROQ_BASE_URL=http://localhost:5179 npm run dev
 * Behaviour for POST /chat/completions:
 *   - default: 200 with a canned reply
 *   - message containing "quota"  -> 429 + Retry-After
 *   - message containing "slow"   -> 20s delay (client timeout is 15s)
 *   - message containing "model"  -> 404 (model unavailable)
 *   - message containing "crash"  -> 500
 */
import { createServer } from 'node:http';

const port = Number(process.argv[2] ?? 5179);

createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }).end();
    return;
  }
  if (req.method !== 'POST' || !req.url.startsWith('/chat/completions')) {
    res.writeHead(404).end();
    return;
  }
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const data = JSON.parse(body || '{}');
    const text = String(data.messages?.[data.messages.length - 1]?.content ?? '');
    const reply = (t) =>
      JSON.stringify({ choices: [{ message: { role: 'assistant', content: t } }] });

    const send = (status, payload, headers = {}) => {
      res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
      res.end(payload);
    };

    if (/quota/i.test(text)) return send(429, JSON.stringify({ error: 'rate limit' }), { 'Retry-After': '30' });
    if (/slow/i.test(text)) {
      setTimeout(() => send(200, reply('finally answered')), 20_000);
      return;
    }
    if (/model/i.test(text)) return send(404, JSON.stringify({ error: 'model not found' }));
    if (/crash/i.test(text)) return send(500, JSON.stringify({ error: 'internal error' }));
    send(200, reply('Mock reply: this came from the mock Groq server.'));
  });
}).listen(port, () => console.log(`[mock-groq] listening on http://localhost:${port}/chat/completions`));
