import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// The deploy URL. Override with the SITE_URL environment variable at build time
// (e.g. SITE_URL=https://your-domain.vercel.app npm run build).
const siteUrl = process.env.SITE_URL || 'https://vikash-portfolio.vercel.app';

export default defineConfig({
  site: siteUrl,
  // The Astro dev toolbar is permanently disabled for this project.
  devToolbar: { enabled: false },
  // Pages stay fully static; routes with `prerender = false` (the chatbot API)
  // become on-demand serverless functions on Vercel.
  adapter: vercel(),
  env: {
    // Folio chatbot secrets: `secret` access is read lazily at RUNTIME from
    // process.env (Vercel) / .env files (dev) and is NEVER inlined into any
    // client or server bundle.
    schema: {
      CHATBOT_ENABLED: envField.boolean({ context: 'server', access: 'secret', default: true }),
      GROQ_API_KEY: envField.string({ context: 'server', access: 'secret', default: '' }),
      GROQ_MODEL: envField.string({ context: 'server', access: 'secret', default: 'openai/gpt-oss-20b' }),
      GROQ_BASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'https://api.groq.com/openai/v1',
      }),
      // Soft per-IP requests/minute brake (per serverless instance). Raise
      // temporarily for load testing if you like; production-grade global
      // limiting belongs in Vercel Firewall.
      CHAT_RATE_LIMIT_PER_IP: envField.number({ context: 'server', access: 'secret', default: 10 }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
