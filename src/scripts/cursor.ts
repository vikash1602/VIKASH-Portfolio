/**
 * Custom cursor: desktop only (fine pointer, >=1024px, motion allowed).
 * A 24px difference-blend circle that grows to a 60px yellow ring over
 * interactive elements. The native cursor is hidden only while it is active.
 */
const dot = document.getElementById('cursor');

const fine = window.matchMedia('(pointer: fine)').matches;
const wide = window.matchMedia('(min-width: 1024px)').matches;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (dot && fine && wide && !reduce) {
  document.documentElement.classList.add('has-cursor');
  const INTERACTIVE = 'a, button, input, textarea, select, label, [data-cursor]';
  let shown = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (!shown) {
        shown = true;
        dot.classList.add('is-active');
      }
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    },
    { passive: true },
  );

  window.addEventListener(
    'pointerover',
    (e) => {
      const target = e.target as Element | null;
      const interactive = target?.closest?.(INTERACTIVE);
      // Elements marked data-cursor-plain (e.g. the FOLIO-01 launcher) keep the
      // small difference-blend dot so the cursor ring never covers the mascot.
      dot.classList.toggle('is-hover', !!interactive && !interactive.hasAttribute('data-cursor-plain'));
    },
    { passive: true },
  );
}

export {};
