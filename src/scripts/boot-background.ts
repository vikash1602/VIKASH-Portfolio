/**
 * Boots the Three.js background AFTER the page has settled (window load +
 * idle), so its parse/execute cost never blocks first paint or interaction.
 * With reduced motion it still loads once to draw the single static frame.
 */
let started = false;
const start = () => {
  if (started) return;
  started = true;
  import('./three-background');
};

const whenIdle = () => {
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void })
      .requestIdleCallback(start, { timeout: 3000 });
  } else {
    setTimeout(start, 1200);
  }
};

if (document.readyState === 'complete') {
  whenIdle();
} else {
  window.addEventListener('load', whenIdle, { once: true });
}
