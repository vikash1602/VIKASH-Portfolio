/**
 * One-time asset generation (re-run with `npm run assets:images`):
 *  - converts the portrait PNG to a WebP
 *  - renders the three generated project cover artworks (geometric SVG art —
 *    stand-ins until real screenshots are provided, see README)
 *  - renders the 1200x630 OG image and the 180x180 apple-touch icon
 *  - writes src/data/image-dims.json so components can set width/height
 */
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const IMG = path.join(ROOT, 'public', 'images');
const OUT = path.join(IMG, 'projects');
mkdirSync(OUT, { recursive: true });

const dims = {};

async function pngToWebp(srcFile, outFile, width, quality = 82) {
  const img = sharp(path.join(IMG, srcFile));
  const meta = await img.metadata();
  const w = Math.min(width, meta.width || width);
  const info = await img
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality })
    .toFile(path.join(IMG, outFile));
  return { width: info.width, height: info.height };
}

async function svgToWebp(svg, outFile, width, height, quality = 82) {
  const info = await sharp(Buffer.from(svg))
    .resize({ width, height })
    .webp({ quality })
    .toFile(path.join(OUT, outFile));
  return { width: info.width, height: info.height };
}

async function svgToPng(svg, outFile, width, height) {
  await sharp(Buffer.from(svg))
    .resize({ width, height })
    .png({ compressionLevel: 9 })
    .toFile(path.join(ROOT, 'public', outFile));
}

/* ------------------------------ project art ------------------------------ */
// Shared black canvas with a faint grid, framed for 16:9.
const frame = (inner) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1280" height="720" fill="#121212"/>
  <rect width="1280" height="720" fill="url(#grid)"/>
  ${inner}
</svg>`;

const cardioxaiSvg = frame(`
  <polyline points="60,240 320,240 380,240 420,120 470,380 520,60 570,300 620,240 780,240 840,190 900,290 960,240 1220,240"
    fill="none" stroke="#33FF57" stroke-width="8" stroke-linejoin="round" stroke-linecap="square"/>
  <rect x="60" y="470" width="420" height="34" fill="#FBFF48"/>
  <rect x="60" y="530" width="300" height="34" fill="#FF70A6"/>
  <rect x="60" y="590" width="220" height="34" fill="#3B82F6"/>
  <rect x="60" y="650" width="150" height="34" fill="#FF9F1C"/>
  <rect x="560" y="470" width="660" height="214" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3"/>
  <polyline points="590,660 700,600 810,620 920,540 1030,560 1140,500 1200,510"
    fill="none" stroke="#A855F7" stroke-width="8" stroke-linecap="square"/>
  <rect x="1130" y="80" width="90" height="90" fill="none" stroke="#FF2A2A" stroke-width="6"/>
  <rect x="1152" y="102" width="46" height="46" fill="#FF2A2A"/>
`);

const tataVizSvg = frame(`
  <rect x="60" y="70" width="360" height="580" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3"/>
  <rect x="100" y="520" width="60" height="90" fill="#FBFF48"/>
  <rect x="190" y="440" width="60" height="170" fill="#FBFF48"/>
  <rect x="280" y="330" width="60" height="280" fill="#FBFF48"/>
  <rect x="100" y="110" width="240" height="18" fill="#ffffff" fill-opacity="0.3"/>
  <rect x="480" y="70" width="360" height="580" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3"/>
  <polyline points="510,560 590,470 670,520 750,360 800,420 510,560" fill="none"/>
  <polyline points="510,560 590,470 670,520 750,360 800,420 860,300" fill="none" stroke="#FF70A6" stroke-width="10" stroke-linecap="square"/>
  <rect x="480" y="70" width="60" height="24" fill="#FF70A6"/>
  <circle cx="1020" cy="330" r="150" fill="none" stroke="#3B82F6" stroke-width="42" stroke-dasharray="471 943" transform="rotate(-90 1020 330)"/>
  <circle cx="1020" cy="330" r="150" fill="none" stroke="#A855F7" stroke-width="42" stroke-dasharray="283 943" stroke-dashoffset="-471" transform="rotate(-90 1020 330)"/>
  <circle cx="1020" cy="330" r="150" fill="none" stroke="#FF9F1C" stroke-width="42" stroke-dasharray="189 943" stroke-dashoffset="-754" transform="rotate(-90 1020 330)"/>
  <rect x="900" y="70" width="240" height="18" fill="#ffffff" fill-opacity="0.3"/>
`);

const haarSvg = frame(`
  <circle cx="640" cy="300" r="150" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="10"/>
  <path d="M420 640 Q640 470 860 640" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="10"/>
  <g stroke="#33FF57" stroke-width="10" fill="none">
    <polyline points="430,180 430,120 490,120"/>
    <polyline points="850,180 850,120 790,120"/>
    <polyline points="430,420 430,480 490,480"/>
    <polyline points="850,420 850,480 790,480"/>
  </g>
  <rect x="510" y="230" width="110" height="110" fill="none" stroke="#33FF57" stroke-width="8"/>
  <rect x="700" y="300" width="70" height="70" fill="none" stroke="#33FF57" stroke-width="6"/>
  <line x1="0" y1="330" x2="1280" y2="330" stroke="#FF70A6" stroke-width="4" stroke-dasharray="30 18"/>
  <g fill="#ffffff" fill-opacity="0.25">
    <rect x="90" y="130" width="40" height="40"/><rect x="90" y="210" width="40" height="40"/>
    <rect x="170" y="170" width="40" height="40"/><rect x="90" y="290" width="40" height="40"/>
    <rect x="170" y="250" width="40" height="40"/><rect x="90" y="370" width="40" height="40"/>
  </g>
`);

/* ------------------------------- OG image -------------------------------- */
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#121212" fill-opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#FFFDF5"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect x="28" y="28" width="1144" height="574" fill="none" stroke="#121212" stroke-width="8"/>
  <rect x="60" y="80" width="360" height="44" fill="#33FF57" stroke="#121212" stroke-width="3" transform="rotate(-2 60 80)"/>
  <text x="78" y="112" font-family="Arial, sans-serif" font-weight="bold" font-size="24" fill="#121212">SYSTEM STATUS: ONLINE</text>
  <text x="60" y="250" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-size="110" fill="#121212" letter-spacing="-2">FULL STACK</text>
  <text x="60" y="360" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-size="110" fill="none" stroke="#121212" stroke-width="3" letter-spacing="-2">DEVELOPER</text>
  <rect x="60" y="410" width="640" height="70" fill="#FBFF48" stroke="#121212" stroke-width="4" transform="rotate(-1 60 410)"/>
  <text x="84" y="456" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#121212">I build web apps and ML systems that explain themselves.</text>
  <text x="60" y="540" font-family="Arial, sans-serif" font-weight="bold" font-size="26" fill="#121212">VIKASH G // REACT &#8226; DJANGO &#8226; PYTHON &#8226; AWS</text>
  <text x="60" y="580" font-family="Arial, sans-serif" font-size="20" fill="#121212" fill-opacity="0.6">VIKASH.exe // PORTFOLIO</text>
</svg>`;

/* --------------------------- icons (no text) ----------------------------- */
const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#121212"/>
  <rect x="10" y="10" width="160" height="160" fill="none" stroke="#FBFF48" stroke-width="8"/>
  <path d="M48 52 L90 132 L132 52" fill="none" stroke="#33FF57" stroke-width="18" stroke-linecap="square" stroke-linejoin="miter"/>
  <rect x="118" y="118" width="24" height="24" fill="#FF70A6"/>
</svg>`;

/* --------------------------------- run ----------------------------------- */
const portrait = await pngToWebp('portrait-src.png', 'portrait.webp', 900);
dims.portrait = portrait;

dims['tata-data-viz'] = await svgToWebp(tataVizSvg, 'tata-data-viz.webp', 1280, 720);
dims['haar-cascades'] = await svgToWebp(haarSvg, 'haar-cascades.webp', 1280, 720);
dims.cardioxai = await svgToWebp(cardioxaiSvg, 'cardioxai.webp', 1280, 720);

await svgToPng(ogSvg, 'og-image.png', 1200, 630);
await svgToPng(iconSvg(180), 'apple-touch-icon.png', 180, 180);

writeFileSync(
  path.join(ROOT, 'src', 'data', 'image-dims.json'),
  JSON.stringify(dims, null, 2) + '\n',
);
console.log('[generate-assets] done:', JSON.stringify(dims));
