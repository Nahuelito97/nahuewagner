// Actualiza el <lastmod> del sitemap con la fecha del build.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const sitemapPath = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url));
const today = new Date().toISOString().slice(0, 10);

const xml = readFileSync(sitemapPath, 'utf8').replace(
	/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
	`<lastmod>${today}</lastmod>`,
);

writeFileSync(sitemapPath, xml);
console.log(`sitemap.xml lastmod -> ${today}`);
