// Build-time: baja TODO el contenido del CMS (nahuewagner-api) y lo hornea en
// src/content/*.json + genera un módulo de iconos con solo los íconos usados
// (para no bloatear el bundle público). El sitio queda 100% estático.
// Si el API no responde, se usa el último snapshot commiteado (build robusto).
import { access, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'src', 'content');
const API = process.env.CMS_API_URL ?? 'http://localhost:3000';
const TIMEOUT_MS = 8000;

const LIB_PATHS = { fa: 'react-icons/fa', fi: 'react-icons/fi', si: 'react-icons/si' };

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchBundle() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API}/content`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const writeJson = (name, data) =>
  writeFile(join(OUT, name), JSON.stringify(data, null, 2) + '\n');

// genera src/content/icons.generated.ts con solo los íconos usados
async function writeIconModule(refs) {
  const byLib = { fa: new Set(), fi: new Set(), si: new Set() };
  for (const { iconLib, iconName } of refs) {
    if (byLib[iconLib] && iconName) byLib[iconLib].add(iconName);
  }
  const imports = [];
  const entries = [];
  for (const lib of ['fa', 'fi', 'si']) {
    const names = [...byLib[lib]].sort();
    if (!names.length) continue;
    imports.push(`import { ${names.join(', ')} } from '${LIB_PATHS[lib]}';`);
    for (const n of names) entries.push(`  '${lib}:${n}': ${n},`);
  }
  const code = `// AUTO-GENERADO por scripts/fetch-content.mjs — no editar a mano.
import type { IconType } from 'react-icons';
${imports.join('\n')}

export const ICONS: Record<string, IconType> = {
${entries.join('\n')}
};
`;
  await writeFile(join(OUT, 'icons.generated.ts'), code);
}

const SITE_URL = process.env.SITE_URL ?? 'https://wagnerlabs.dev';

async function writeSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/" />
  </url>
</urlset>
`;
  await writeFile(join(ROOT, 'public', 'sitemap.xml'), xml);
  console.log('[fetch-content] ✓ sitemap.xml');
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const portfolioPath = join(OUT, 'portfolio.json');
  try {
    const b = await fetchBundle();

    await writeJson('portfolio.json', b.projects);
    await writeJson('timeline.json', b.timeline);
    await writeJson('services.json', b.services);
    await writeJson('skills.json', b.skillCategories);
    await writeJson('techIcons.json', b.techIcons);
    await writeJson('social.json', b.social);
    await writeJson('testimonials.json', b.testimonials);
    await writeJson('copy.json', b.copy);

    const iconRefs = [
      ...b.services.map((s) => ({ iconLib: s.iconLib, iconName: s.iconName })),
      ...b.skillCategories.flatMap((c) =>
        c.skills.map((s) => ({ iconLib: s.iconLib, iconName: s.iconName })),
      ),
      ...b.techIcons.map((t) => ({ iconLib: t.iconLib, iconName: t.iconName })),
    ];
    await writeIconModule(iconRefs);
    await writeSitemap();

    console.log(
      `[fetch-content] ✓ ${b.projects.length} proy, ${b.timeline.length} exp, ` +
        `${b.services.length} serv, ${b.skillCategories.length} cats, ${b.techIcons.length} icons, ` +
        `${b.social.length} redes, ${b.testimonials.length} test, ${b.copy.length} textos desde ${API}`,
    );
  } catch (err) {
    if (await fileExists(portfolioPath)) {
      console.warn(
        `[fetch-content] ⚠ CMS no disponible (${err.message}). Uso el snapshot existente.`,
      );
    } else {
      console.error(`[fetch-content] ✗ CMS no disponible y sin snapshot: ${err.message}`);
      process.exit(1);
    }
  }
}

main();
