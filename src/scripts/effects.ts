/**
 * Page effects: scroll progress bar, scroll reveal, 3D card tilt, mobile
 * menu, and the contact form (validation, honeypot, fetch with inline status).
 */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ----------------------------- progress bar ------------------------------ */
{
  const bar = document.getElementById('progress');
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            update();
            ticking = false;
          });
        }
      },
      { passive: true },
    );
    window.addEventListener('resize', update, { passive: true });
    update();
  }
}

/* ------------------------------ scroll reveal ---------------------------- */
{
  const elements = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );
    elements.forEach((el) => io.observe(el));
  }
}

/* ------------------------------- 3D card tilt ---------------------------- */
// Subtle by design: ±2° rotation, 2px lift, gentle 1200px perspective —
// noticeably calmer than the original ±10° effect.
if (!reduce && finePointer) {
  const TILT_MAX = 2; // degrees
  const LIFT_PX = 2;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.style.transition = 'transform 0.22s ease-out';
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 2 * TILT_MAX;
      const rotateX = (0.5 - py) * 2 * TILT_MAX;
      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${LIFT_PX}px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

/* ------------------------------- mobile menu ----------------------------- */
{
  const btn = document.getElementById('menu-btn');
  const panel = document.getElementById('mobile-menu');
  if (btn && panel) {
    const setOpen = (open: boolean) => {
      panel.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('.menu-open-icon')?.classList.toggle('hidden', open);
      btn.querySelector('.menu-close-icon')?.classList.toggle('hidden', !open);
    };
    btn.addEventListener('click', () => {
      setOpen(panel.classList.contains('hidden'));
    });
    panel.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
        setOpen(false);
        btn.focus();
      }
    });
  }
}

/* ------------------------------- contact form ---------------------------- */
{
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (form) {
    const status = document.getElementById('form-status') as HTMLParagraphElement;
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const defaultLabel = submitBtn.dataset.defaultLabel ?? submitBtn.textContent ?? 'SEND';
    const endpoint = form.dataset.endpoint ?? '';

    const fields = {
      name: {
        input: form.querySelector<HTMLInputElement>('#cf-name')!,
        error: document.getElementById('cf-name-error')!,
        valid: (v: string) => v.trim().length > 0,
      },
      email: {
        input: form.querySelector<HTMLInputElement>('#cf-email')!,
        error: document.getElementById('cf-email-error')!,
        valid: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      },
      message: {
        input: form.querySelector<HTMLTextAreaElement>('#cf-message')!,
        error: document.getElementById('cf-message-error')!,
        valid: (v: string) => v.trim().length > 0,
      },
    } as const;

    const setError = (field: (typeof fields)[keyof typeof fields], hasError: boolean) => {
      field.error.hidden = !hasError;
      field.input.setAttribute('aria-invalid', String(hasError));
    };

    // Clear an error as soon as the field becomes valid again.
    for (const field of Object.values(fields)) {
      field.input.addEventListener('input', () => {
        if (!field.error.hidden && field.valid(field.input.value)) setError(field, false);
      });
    }

    const showStatus = (text: string, isError: boolean) => {
      status.textContent = text;
      status.style.color = isError ? 'var(--color-neo-red)' : 'var(--color-neo-green)';
    };

    /** Status with a clickable mailto fallback (static link, no user input). */
    const showFallbackStatus = (lead: string) => {
      const email = form.dataset.contactEmail ?? '';
      status.textContent = '';
      const span = document.createElement('span');
      span.textContent = `${lead} `;
      const link = document.createElement('a');
      link.href = `mailto:${email}?subject=${encodeURIComponent('Project Inquiry')}`;
      link.textContent = email;
      link.className = 'underline decoration-2 underline-offset-2 break-all';
      status.style.color = 'var(--color-neo-red)';
      status.append(span, link);
    };

    let sending = false; // duplicate-submission guard alongside the disabled button

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (sending) return;
      showStatus('', false);

      let firstInvalid: HTMLElement | null = null;
      for (const field of Object.values(fields)) {
        const ok = field.valid(field.input.value);
        setError(field, !ok);
        if (!ok && !firstInvalid) firstInvalid = field.input;
      }
      if (firstInvalid) {
        firstInvalid.focus();
        showStatus('Please fix the highlighted fields.', true);
        return;
      }

      // Honeypot filled -> silently pretend success without sending anything.
      const honeypot = form.querySelector<HTMLInputElement>('input[name="_gotcha"]');
      if (honeypot?.value) {
        form.reset();
        showStatus('Message received.', false);
        return;
      }

      const payload = {
        name: fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        message: fields.message.input.value.trim(),
        _subject: 'Project Inquiry — VIKASH.exe portfolio',
      };

      // No provider configured: be honest — offer the working email link
      // instead of pretending the form can send.
      if (!endpoint) {
        showFallbackStatus('The contact form is temporarily unavailable — please email me directly:');
        return;
      }

      sending = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'SENDING...';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        showStatus('Message sent — thank you! I will reply soon.', false);
      } catch {
        showFallbackStatus('Message could not be sent — please email me directly:');
      } finally {
        sending = false;
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
      }
    });
  }
}

export {};
