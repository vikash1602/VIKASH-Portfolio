/**
 * Secret-exposure audit — run before every deploy (also good as a CI step).
 * Scans source (tracked files) and production output for secret-like strings.
 * Reports filenames + locations ONLY, never secret values.
 *
 * What must NEVER appear in client-reachable assets:
 *   - the Groq key value (gsk_…)
 *   - the env-var name GROQ_API_KEY (client code has no business reading it)
 *   - the Groq API origin (the browser talks only to /api/chat)
 *   - an Authorization header built in client code
 * The serverless bundle may reference the env-var NAME (it must read it) but
 * never a literal key value.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
let failures = 0;

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

function scan(label, dir, patterns, { allowEnvVarName = false } = {}) {
  const active = allowEnvVarName
    ? patterns.filter((p) => p.label !== 'env-var name')
    : patterns;
  for (const file of walk(dir)) {
    const rel = path.relative(ROOT, file);
    if (rel.includes('.env.local') || rel.includes('node_modules')) continue;
    let content;
    try {
      content = readFileSync(file, 'utf8');
    } catch {
      continue; // binary
    }
    for (const { label: what, re } of active) {
      const idx = content.search(re);
      if (idx !== -1) {
        const line = content.slice(0, idx).split('\n').length;
        console.error(`!! ${label}: ${what} found in ${rel}:${line}`);
        failures += 1;
      }
    }
  }
}

const CLIENT_PATTERNS = [
  { label: 'Groq key value', re: /gsk_[A-Za-z0-9]{20,}/ },
  { label: 'env-var name', re: /GROQ_API_KEY/ },
  { label: 'Groq API origin', re: /api\.groq\.com/ },
  { label: 'Authorization header', re: /["'`]Authorization["'`]\s*[:=]/ },
];

console.log('[security] scanning client-reachable production output (dist/client)…');
scan('CLIENT', path.join(ROOT, 'dist', 'client'), CLIENT_PATTERNS);

console.log('[security] scanning serverless bundle for literal key values only…');
scan(
  'SERVER-FN',
  path.join(ROOT, '.vercel', 'output'),
  [{ label: 'Groq key value', re: /gsk_[A-Za-z0-9]{20,}/ }],
);

console.log('[security] scanning tracked source files for literal key values…');
// The Groq origin inside src/server/* is legitimate (server-side default);
// what must never appear in tracked source is a literal key value.
scan(
  'SOURCE',
  ROOT,
  [{ label: 'Groq key value', re: /gsk_[A-Za-z0-9]{20,}/ }],
);

if (failures > 0) {
  console.error(`\n[security] FAILED — ${failures} finding(s). Stop deployment and remove the secret(s).`);
  process.exit(1);
}
console.log('[security] clean — no secret material in client output, function bundle, or tracked source.');
