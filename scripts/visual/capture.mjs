/**
 * Captura el sitio entero, a varios viewports, para poder comparar ANTES y
 * DESPUÉS de un cambio que la suite de tests no puede ver.
 *
 * Existe porque los tests unitarios no miran el sitio: la migración a
 * Tailwind 4 abrió el interlineado del <h1> del hero ~18px por línea y
 * `lint`, `typecheck`, `test` y `build` pasaron los cuatro en verde.
 *
 * USO
 *   1. npm run dev            (en otra terminal)
 *   2. npm run visual:capture -- antes
 *   3. ...hacer el cambio...
 *   4. npm run visual:capture -- despues
 *   5. npm run visual:compare -- antes despues
 *
 * VARIABLES
 *   SHOT_URL     URL a capturar          (default http://localhost:5173/)
 *   BROWSER_EXE  ruta a un Chromium/Chrome/Edge instalado
 *   SHOT_DIR     dónde guardar           (default .visual/)
 *
 * Usa `playwright-core` + un navegador YA instalado en la máquina, en vez de
 * `playwright` completo, para no bajar ~150 MB de Chromium por un script de
 * diagnóstico ocasional.
 */
import { chromium } from 'playwright-core';
import { access, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const URL = process.env.SHOT_URL ?? 'http://localhost:5173/';
const OUT = process.env.SHOT_DIR ?? '.visual';
const TAG = process.argv[2];

const VIEWPORTS = [
	{ name: 'desktop', width: 1440, height: 900 },
	{ name: 'tablet', width: 834, height: 1112 },
	{ name: 'mobile', width: 390, height: 844 },
];

/** Rutas típicas de un Chromium ya instalado, por sistema operativo. */
const CANDIDATES = [
	process.env.BROWSER_EXE,
	'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium',
	'/usr/bin/chromium-browser',
].filter(Boolean);

async function findBrowser() {
	for (const p of CANDIDATES) {
		try {
			await access(p);
			return p;
		} catch {
			// siguiente candidato
		}
	}
	throw new Error(
		'No encontré un Chromium instalado. Pasá la ruta con BROWSER_EXE=/ruta/al/navegador',
	);
}

if (!TAG) {
	console.error('Falta el tag. Ej: npm run visual:capture -- antes');
	process.exit(1);
}

const executablePath = await findBrowser();
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
let failed = false;

for (const vp of VIEWPORTS) {
	const ctx = await browser.newContext({
		viewport: { width: vp.width, height: vp.height },
		deviceScaleFactor: 1,
		// Sin esto la foto sale a mitad de un fade o del typewriter y dos
		// corridas nunca son comparables.
		reducedMotion: 'reduce',
		colorScheme: 'dark',
	});
	const page = await ctx.newPage();

	const errors = [];
	page.on('pageerror', (e) => errors.push(String(e)));
	page.on('console', (m) => {
		if (m.type() === 'error') errors.push(m.text());
	});

	await page.goto(URL, { waitUntil: 'networkidle', timeout: 45_000 });
	await page.waitForTimeout(1_000);

	// Recorre la página entera para disparar el lazy-loading y los reveals
	// por scroll antes de sacar la foto full-page.
	await page.evaluate(
		() =>
			new Promise((resolve) => {
				let y = 0;
				const step = () => {
					window.scrollTo(0, y);
					y += window.innerHeight;
					if (y < document.body.scrollHeight) setTimeout(step, 120);
					else {
						window.scrollTo(0, 0);
						setTimeout(resolve, 600);
					}
				};
				step();
			}),
	);
	await page.waitForTimeout(800);

	const file = join(OUT, `${TAG}-${vp.name}.png`);
	await page.screenshot({ path: file, fullPage: true });
	const height = await page.evaluate(() => document.body.scrollHeight);

	console.log(`${vp.name.padEnd(8)} ${file}  alto ${height}px  errores JS: ${errors.length}`);
	if (errors.length) {
		failed = true;
		for (const e of errors.slice(0, 5)) console.log(`   ${e}`);
	}

	await ctx.close();
}

await browser.close();

// Un error de JS en consola es un fallo real, aunque la foto haya salido.
if (failed) process.exit(1);
