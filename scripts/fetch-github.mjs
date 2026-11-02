/**
 * Fetches real GitHub data for the coding-stats section at build time and
 * stores a snapshot in src/data/github-snapshot.json.
 *
 * - GITHUB_TOKEN (optional) is used for the REST API and never leaves this
 *   script — it is not referenced anywhere in client code.
 * - The contribution heatmap comes from the public mirror
 *   github-contributions-api.jogruber.de (real GitHub contribution counts).
 * - On failure the existing snapshot is kept; if none exists, an
 *   "unavailable" snapshot is written and the UI hides the stats.
 *
 * Every number on the page comes from this file. Nothing is invented.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const OUT = path.join(ROOT, 'src', 'data', 'github-snapshot.json');

// Single source of truth for the username lives in src/data/content.ts.
const contentSrc = readFileSync(path.join(ROOT, 'src', 'data', 'content.ts'), 'utf8');
const user =
  process.env.GITHUB_USER ||
  contentSrc.match(/user:\s*'([A-Za-z0-9-]+)'/)?.[1] ||
  'vikash1602';

const GH_HEADERS = {
  'User-Agent': 'portfolio-build-script',
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function fetchJson(url) {
  const res = await fetch(url, { headers: GH_HEADERS });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function fetchHeatmap(username) {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      headers: { 'User-Agent': 'portfolio-build-script' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const days = (data.contributions || []).map((d) => ({
      date: d.date,
      count: d.count,
      level: d.level ?? 0,
    }));
    if (!days.length) throw new Error('empty contributions');
    return { total: days.reduce((s, d) => s + d.count, 0), days };
  } catch (err) {
    console.warn(`[fetch-github] heatmap unavailable: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`[fetch-github] fetching data for ${user}...`);
  const snapshot = {
    fetchedAt: new Date().toISOString(),
    user: null,
    languages: [],
    heatmap: null,
    unavailable: false,
  };
  try {
    const [userRes, reposRes] = await Promise.all([
      fetchJson(`https://api.github.com/users/${user}`),
      fetchJson(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`),
    ]);
    snapshot.user = {
      login: userRes.login,
      publicRepos: userRes.public_repos,
      followers: userRes.followers,
      following: userRes.following,
      createdAt: userRes.created_at,
      profileUrl: userRes.html_url,
    };
    const counts = new Map();
    for (const repo of reposRes) {
      if (repo.fork || !repo.language) continue;
      counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
    }
    snapshot.languages = [...counts.entries()]
      .map(([name, repos]) => ({ name, repos }))
      .sort((a, b) => b.repos - a.repos)
      .slice(0, 5);
    snapshot.heatmap = await fetchHeatmap(user);
  } catch (err) {
    console.warn(`[fetch-github] API fetch failed: ${err.message}`);
    if (existsSync(OUT)) {
      const existing = JSON.parse(readFileSync(OUT, 'utf8'));
      if (existing && !existing.unavailable) {
        console.warn('[fetch-github] keeping existing snapshot.');
        writeFileSync(OUT, JSON.stringify(existing, null, 2) + '\n');
        return;
      }
    }
    snapshot.unavailable = true;
  }

  writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(
    snapshot.unavailable
      ? '[fetch-github] wrote UNAVAILABLE snapshot (UI will hide live numbers).'
      : `[fetch-github] snapshot written: repos=${snapshot.user.publicRepos} followers=${snapshot.user.followers} joined=${snapshot.user.createdAt} languages=${snapshot.languages.length} heatmap=${snapshot.heatmap ? snapshot.heatmap.total + ' contributions' : 'none'}`,
  );
}

main();
