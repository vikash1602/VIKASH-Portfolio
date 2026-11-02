/**
 * Post-build gate: no [[PROVIDE]] / [[CONFIRM]] placeholder text may leak into
 * the production bundle. Exits 1 (fails the build) when found, unless
 * ALLOW_PLACEHOLDERS=1 is set, in which case it only warns loudly.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');
const MARKERS = ['[[PROVIDE', '[[CONFIRM'];
const EXTENSIONS = new Set(['.html', '.js', '.css', '.xml', '.txt', '.svg', '.json', '.webmanifest']);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function main() {
  let failed = false;
  try {
    for (const file of walk(DIST)) {
      if (!EXTENSIONS.has(path.extname(file))) continue;
      const content = readFileSync(file, 'utf8');
      for (const marker of MARKERS) {
        if (content.includes(marker)) {
          console.error(`\n!! PLACEHOLDER LEAK: "${marker}" found in ${path.relative(process.cwd(), file)}`);
          failed = true;
        }
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('!! dist/ not found — run `astro build` first.');
      process.exit(1);
    }
    throw err;
  }

  if (failed) {
    console.error(
      '\nProduction output contains unresolved placeholders.\n' +
        'Fill the missing values in src/data/content.ts (or set ALLOW_PLACEHOLDERS=1 to bypass this gate).\n',
    );
    process.exit(process.env.ALLOW_PLACEHOLDERS === '1' ? 0 : 1);
  }
  console.log('[check-placeholders] clean — no placeholder text in dist/.');
}

main();
