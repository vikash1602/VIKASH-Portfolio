/**
 * Tiny mock contact endpoint for testing the form locally:
 *   node scripts/mock-contact-server.mjs [port]   (default 5178)
 *
 * Then run the site against it:
 *   VITE_FORM_ENDPOINT=http://localhost:5178/contact npm run build && npm run preview
 *
 * Behaviour: POST /contact accepts JSON {name, email, message}.
 * Returns 200 {"ok":true} unless the message contains "fail" -> 500,
 * so both success and error paths of the form can be exercised.
 */
import { createServer } from 'node:http';

const port = Number(process.argv[2] ?? 5178);
let received = 0;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors).end();
    return;
  }
  if (req.method !== 'POST' || !req.url.startsWith('/contact')) {
    res.writeHead(404, cors).end('not found');
    return;
  }
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    received += 1;
    console.log(`[mock] request #${received}: ${body.slice(0, 200)}`);
    const data = JSON.parse(body || '{}');
    if (String(data.message ?? '').toLowerCase().includes('fail')) {
      res.writeHead(500, { 'Content-Type': 'application/json', ...cors });
      res.end(JSON.stringify({ ok: false, error: 'mock server failure' }));
      return;
    }
    // Simulate a little latency like a real service.
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json', ...cors });
      res.end(JSON.stringify({ ok: true }));
    }, 400);
  });
}).listen(port, () => console.log(`[mock] contact endpoint on http://localhost:${port}/contact`));
