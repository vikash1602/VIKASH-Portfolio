/**
 * One-off setup check (not part of the build):
 * reads the local .env.local, queries the OFFICIAL Groq model catalogue and
 * verifies the configured model exists. Prints model IDs only — never the key.
 */
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);

const key = env.GROQ_API_KEY;
const wanted = env.GROQ_MODEL || 'openai/gpt-oss-20b';
if (!key) {
  console.log('GROQ_API_KEY missing in .env.local — cannot verify catalogue.');
  process.exit(1);
}

const res = await fetch('https://api.groq.com/openai/v1/models', {
  headers: { Authorization: `Bearer ${key}` },
  signal: AbortSignal.timeout(15000),
});
console.log('catalogue HTTP status:', res.status);
if (!res.ok) {
  console.log('could not read catalogue (check key validity / account status)');
  process.exit(1);
}
const data = await res.json();
const ids = data.data.map((m) => m.id).sort();
console.log(`models available to this account (${ids.length}):`);
for (const id of ids) console.log('  -', id);
console.log(`configured model "${wanted}":`, ids.includes(wanted) ? 'AVAILABLE ✓' : 'NOT IN CATALOGUE ✗');
const gptOss = ids.filter((id) => id.includes('gpt-oss'));
if (gptOss.length) console.log('gpt-oss variants present:', gptOss.join(', '));
