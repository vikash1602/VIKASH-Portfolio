/**
 * Optional live refresh of the GitHub numbers (no token, public REST API).
 * On success the LIVE badge replaces the SNAPSHOT date; on any failure the
 * build-time snapshot stays untouched — the numbers on screen are always real.
 */
const section = document.getElementById('coding-stats');
const user = section?.getAttribute('data-gh-user');

if (section && user) {
  const reposEl = section.querySelector<HTMLElement>('[data-gh="repos"]');
  const followersEl = section.querySelector<HTMLElement>('[data-gh="followers"]');
  const snapshotLine = section.querySelector<HTMLElement>('[data-gh="snapshot-line"]');
  const liveBadge = section.querySelector<HTMLElement>('[data-gh="live-badge"]');

  if (reposEl && followersEl) {
    (async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${user}`, { signal: AbortSignal.timeout(8000) }),
          fetch(`https://api.github.com/users/${user}/repos?per_page=100`, {
            signal: AbortSignal.timeout(8000),
          }),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error('github api unavailable');
        const userData = (await userRes.json()) as {
          public_repos: number;
          followers: number;
          following: number;
        };
        if (typeof userData.public_repos !== 'number') throw new Error('unexpected payload');
        reposEl.textContent = String(userData.public_repos);
        followersEl.textContent = String(userData.followers);
        const followingEl = section.querySelector<HTMLElement>('[data-gh="following"]');
        if (followingEl) followingEl.textContent = String(userData.following);
        snapshotLine?.setAttribute('hidden', '');
        liveBadge?.removeAttribute('hidden');
      } catch {
        /* keep the snapshot; nothing on screen changes */
      }
    })();
  }
}

export {};
