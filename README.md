# VIKASH.exe — Neo-Brutalist Portfolio

Single-page developer portfolio for **Vikash G** (Full Stack Developer), built in a
neo-brutalist style with a Three.js wireframe background. Static output, deployable
to Vercel with no server.

**Stack:** Astro 7 (static) · TypeScript · Tailwind CSS 4 (compiled at build time) ·
Three.js `0.186.1` (pinned) · self-hosted Space Grotesk + JetBrains Mono. No UI
framework, no animation library, no trackers, no cookies.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321 — missing content shows as [[PROVIDE: ...]] chips
npm run build      # production build into dist/ (fetches GitHub stats, generates robots/sitemap)
npm run preview    # serve the production build locally
```

Node 18+ (Node 20/24 tested). All commands run on Windows/macOS/Linux.

## Editing content — one file

**Everything on the page lives in [`src/data/content.ts`](src/data/content.ts).**
You never need to touch components to change text, links, dates, projects or skills.

Values that are still unknown are `null` and are **hidden on the production site**
(they render as visible red `[[PROVIDE: ...]]` chips in `npm run dev` only). The
`openItems` list at the bottom of the file mirrors everything still missing, and the
build log warns loudly about it on every production build. A post-build gate
(`scripts/check-placeholders.mjs`) **fails the build** if placeholder text ever leaks
into `dist/`.

### What is still missing (open items)

| Item | Used in | State |
| --- | --- | --- |
| Location (city) + availability status | About badges, Contact | `null` — hidden |
| CGPA wording: "Current" vs "Final" | Education | resume wording used |
| Approval of draft hero tagline / About paragraph / footer tagline | Hero, About, Footer | drafts used |
| GitHub username confirmation | Coding stats | `vikash1602` (from resume) |
| Live demo / repo links per project | Selected works | CardioXAI repo linked; Tata + Haar show COMING SOON |
| Real screenshots per project | Selected works | generated cover art used |
| IRJCS paper URL + certificate URLs | Achievements | no links rendered |
| LeetCode / other coding profile | Coding stats | omitted |
| Testimonial quotes (with permission) | Reports | section hidden while empty |
| Contact form endpoint | Contact | form validates, shows "email me directly" |
| Final deploy URL | SEO (canonical/OG/sitemap) | default Vercel subdomain |

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `SITE_URL` | build | Final URL for canonical/OG/sitemap/robots (e.g. `SITE_URL=https://vikash-portfolio.vercel.app npm run build`). Falls back to the URL in `astro.config.mjs`. |
| `GITHUB_TOKEN` | build only | Optional GitHub token for `scripts/fetch-github.mjs` (avoids API rate limits). Never referenced in client code. |
| `VITE_FORM_ENDPOINT` | build | Formspree/Web3Forms/EmailJS endpoint baked into the form's `data-endpoint`. Without it the form validates and shows an inline "email me directly" message. |
| `GITHUB_USER` | build only | Overrides the GitHub username read from `content.ts`. |

Test the form end-to-end without a real service:

```bash
node scripts/mock-contact-server.mjs 5178
VITE_FORM_ENDPOINT=http://localhost:5178/contact npm run build && npm run preview
```

The mock returns 200 unless the message contains "fail", so success and error
paths are both testable. The form has a honeypot field, inline validation with
`aria-describedby`, and an `aria-live` status region.

## Regenerating assets

```bash
npm run assets:images   # portrait WebP, generated project cover art, OG image, apple-touch icon
npm run fetch:github    # refresh src/data/github-snapshot.json (runs automatically on build)
```

- The About portrait is converted from `public/images/portrait-src.png` (re-add the
  source PNG before rerunning).
- The three project "screenshots" are **generated cover art** (geometric SVG → WebP
  in `scripts/generate-assets.mjs`) — replace them with real screenshots in
  `public/images/projects/` and set `screenshot: true` per project in `content.ts`.
- Coding stats show **only real data** (repos, followers, joined, top languages by
  repo count, contribution heatmap via the public `github-contributions-api.jogruber.de`
  mirror). A snapshot is stored at build time; the page optionally refreshes the
  numbers client-side and shows a LIVE badge only when that succeeded, otherwise it
  shows `SNAPSHOT: <date>`. Nothing is ever invented.

## Folio — AI portfolio assistant (Groq, free tier)

The site ships **Folio**, a chat assistant that answers questions about Vikash's
skills, projects, internship, education and achievements. It exists in two
places sharing one conversation state:

- the floating **FOLIO-01** mascot (bottom-right, all viewports),
- a dedicated **TALK_TO_VIKASH.exe** section between SELECTED WORKS and CONTACT.

### FOLIO-01 — the Digital Origami Creature

The launcher is not an icon — it is an original character designed for this
portfolio (`src/components/FolioMascot.astro`, pure inline SVG + CSS keyframes,
zero libraries):

- a folded, layered yellow origami shell with visible creases and a white flap,
- a small terminal face plate with two **asymmetrical pixel eyes that blink
  independently** and look around,
- a **bookmark-shaped tail** (pink stripe) and a **cursor-arrow antenna** — the
  two signature features,
- one expressive arm that waves on hover, plus drifting geometric particles.

The mascot reacts to the conversation through a `data-mood` attribute set by
the chat controller: `idle` (float + blink) → `thinking` (squint, "o" mouth,
three-dot speech bubble, fast antenna) → `talking` (pulsing mouth) → `happy`
(arc eyes, bounce, sparkles) or `error` (concerned slants, drooped antenna)
→ back to `idle`. Hovering shows his speech bubble; every animation is
transform/opacity CSS and switches off under `prefers-reduced-motion`.

### How the brain works

```
browser ──POST /api/chat──▶ serverless function ──Bearer GROQ_API_KEY──▶ Groq
        (only endpoint)      (src/pages/api/chat.ts)   (server-side only)   (openai/gpt-oss-20b)
```

Three response layers, in order:

1. **Local personality engine** — greetings, small talk, jokes, cricket banter,
   pizza, meaning-of-life, and a contact/resume FAQ built from real data.
   Clearly-matched intents never cost an API call.
2. **Portfolio knowledge engine** — keyword retrieval over
   `src/data/chatbotKnowledge.ts` sends only the relevant context slice.
3. **Groq general intelligence** — general knowledge, famous people, science,
   casual conversation and follow-ups, with a personality-tuned system prompt
   (humour 6/10: informative first, entertaining second; never forces every
   topic back to Vikash; asks a clarifying question when ambiguous; sensitive
   topics are handled seriously; portfolio facts are never invented).

The browser sends only `{ message, history }`; the trusted system prompt and
knowledge context are rebuilt server-side per request. Usage controls:
800-char messages, last 6 turns, 350 max output tokens, temperature 0.5,
`reasoning_effort: low`. Errors are visitor-friendly and typed (`quota` 429 +
`Retry-After`, `model-unavailable`, `timeout` 15 s single-window,
`provider-error` with one retry, `not-configured`) — and there is no paid-model
fallback anywhere. Conversation state is browser-memory only, never stored.

The key never touches the browser. It lives in `.env.local` / Vercel env vars
and is read through `astro:env/server` secrets, resolved at runtime and never
inlined into any bundle (verified by `npm run audit`).

### Local setup

```bash
cp .env.example .env.local   # then fill GROQ_API_KEY (never commit it)
npm run dev                  # Folio is live at /api/chat
```

Test error paths without quota using the mock provider:

```bash
node scripts/mock-groq-server.mjs 5179          # 429 / 500 / timeout / 404 modes
GROQ_BASE_URL=http://localhost:5179 npm run dev
```

Verify the configured model against the official catalogue (prints model IDs
only, never the key):

```bash
node scripts/check-groq-model.mjs
```

### Security audit

```bash
node scripts/security-audit.mjs   # scans client output, serverless bundle, tracked source
```

Checks: no `gsk_…` key value, no `GROQ_API_KEY` name, no `api.groq.com` origin
and no `Authorization` header in **client** assets; no literal key in the
serverless bundle or tracked source. Run it before every deploy (wire it into CI
when the repo exists).

### Rate limiting (honest note)

`src/server/chatbot.ts` implements an in-memory sliding-window brake
(10 req/min/IP, 60 req/min/instance, `CHAT_RATE_LIMIT_PER_IP` to override).
On serverless this is **per instance and resets on cold start** — it is a soft
brake, not global protection. For production-grade limiting add a Vercel
Firewall (WAF) rate rule on `POST /api/chat` (Vercel dashboard → your project →
Firewall), which runs in front of the function.

### Disabling Folio

Set `CHATBOT_ENABLED=false` — the launcher, the section and the API all switch
off (the API answers 503, the UI is not rendered).

## Deploying to Vercel

1. Push this folder to a Git repository (GitHub recommended).
2. [vercel.com/new](https://vercel.com/new) → import the repo. Vercel auto-detects Astro.
3. Add environment variables in the Vercel project settings (Production):
   - `SITE_URL` — your final URL (e.g. `https://<project>.vercel.app`)
   - `VITE_FORM_ENDPOINT` — once you have a Formspree/Web3Forms endpoint
   - `GROQ_API_KEY` — for Folio (server-side env var, **not** prefixed `VITE_`)
   - `GROQ_MODEL` — `openai/gpt-oss-20b` (verify availability with `scripts/check-groq-model.mjs`)
   - `GITHUB_TOKEN` — optional, avoids build-time GitHub rate limits
4. Deploy. Then update `siteUrl` in `src/data/content.ts` / `SITE_URL` to the final
   domain so canonical/OG/sitemap URLs are correct.
5. Add a Vercel Firewall rate rule on `POST /api/chat` (see the rate-limiting note above).
6. Run `node scripts/security-audit.mjs` locally after each build; every production
   build also logs the open-items list and refuses to ship placeholder text.

CLI alternative:

```bash
npm i -g vercel && vercel --prod
```

## Project structure

```
src/
  data/content.ts        ← ALL text, links, dates, projects, skills (edit here)
  data/github-snapshot.json  ← generated at build time (real GitHub numbers)
  data/image-dims.json   ← generated image dimensions
  layouts/Layout.astro   ← <head>, SEO, JSON-LD, fonts, progress bar, cursor, canvas
  components/*.astro     ← Nav, Hero, Marquee, About, Skills, Experience,
                           CodingStats, Projects, Reports, ReportCard, Contact, Footer
  scripts/               ← client-side effects (see below)
  styles/global.css      ← design tokens + brutalist primitives
scripts/                 ← build-time node scripts (github fetch, assets, seo, checks)
public/                  ← resume PDF, fonts, images, favicon, robots.txt, sitemap.xml
verification/            ← screenshots + Lighthouse JSON from the build verification
```

### Client-side effects (`src/scripts/`)

- `boot-background.ts` — loads the 3D scene as a separate chunk after window load
  + idle, so it never blocks paint/interaction.
- `three-background.ts` — 28 wireframe meshes (14 < 768 px) in the palette colours,
  mouse-follow + scroll tilt, pixel-ratio cap 2, pauses when the tab is hidden,
  disposes on teardown, single static frame under `prefers-reduced-motion`.
- `cursor.ts` — custom difference-blend cursor, ≥ 1024 px + fine pointer only,
  grows over interactive elements; native cursor hidden only while it is active.
- `effects.ts` — scroll progress bar, IntersectionObserver reveals, 3D card tilt,
  mobile menu (Escape/link close), contact form (validation, honeypot, fetch,
  `aria-live` status).
- `github-live.ts` — optional token-free refresh of the GitHub numbers.

## Design system

Tokens in `global.css` (`@theme`): `neo-white #FFFDF5`, `neo-black #121212`,
`neo-yellow #FBFF48`, `neo-pink #FF70A6`, `neo-blue #3B82F6`, `neo-green #33FF57`,
`neo-purple #A855F7`, `neo-orange #FF9F1C`, `neo-red #FF2A2A`. Cream page with a
1 px dot every 40 px + faint 100 px grid; hard offset shadows (2/4/8/12 px, no
blur); press-on-hover buttons; terminal vocabulary (`.exe`, `>_`, `///`, `$ ... _`).
Section rhythm: hero → blue marquee → about → tech (black) → journey → stats
(black) → works (yellow) → contact → footer (black, green top border).

Accessibility: skip link, semantic landmarks, one `h1`, visible thick focus ring
with yellow offset, labelled form fields, `aria-live` status, pausing marquees with
`aria-hidden` duplicates, and a global `prefers-reduced-motion` kill-switch.

## Verification (this build)

- Lighthouse desktop: Performance **100**, Accessibility **96**, Best Practices **100**,
  SEO **100**. Mobile: **81 / 96 / 100 / 100**. (The only contrast flag is the
  intentional aria-hidden ghost word.)
- JS budget: ~2.9 KB gz initial + 130 KB gz Three.js chunk (loaded after load) —
  under the 250 KB target.
- Checked at 1920 / 1280 / 768 / 375 / 320 px: no horizontal scroll, headings fit.
- Keyboard walkthrough, mobile menu, skip link, form success/error/validation/
  honeypot (against a mock), reduced-motion CSS — see `verification/`.
