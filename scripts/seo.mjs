/**
 * Generates public/robots.txt and public/sitemap.xml from the site URL
 * (SITE_URL env var, falling back to the URL in astro.config.mjs).
 * Runs automatically before every build.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const url = (process.env.SITE_URL || 'https://vikash-portfolio.vercel.app').replace(/\/+$/, '');
const pub = path.join(process.cwd(), 'public');
mkdirSync(pub, { recursive: true });

writeFileSync(
  path.join(pub, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  path.join(pub, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
);

console.log(`[seo] robots.txt + sitemap.xml generated for ${url}`);
