/**
 * Compara dos capturas de `visual/capture.mjs` y dice CUÁNTO y DÓNDE cambió.
 *
 * El porcentaje solo no alcanza: un corrimiento de 18px arriba de todo mueve
 * la página entera y da 2.5% de píxeles distintos, que a primera vista parece
 * catástrofe y es un solo `line-height`. Por eso además de la cifra global
 * reporta la PRIMERA fila que difiere y las franjas donde se concentra: eso
 * distingue "cambió una cosa y arrastró el resto" de "cambió todo".
 *
 * USO
 *   npm run visual:compare -- antes despues
 *
 * Escribe .visual/diff-<viewport>.png resaltando los píxeles distintos.
 */
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = process.env.SHOT_DIR ?? '.visual';
const [A, B] = process.argv.slice(2);
const VIEWPORTS = ['desktop', 'tablet', 'mobile'];
const BAND = 400;

if (!A || !B) {
	console.error('Faltan los tags. Ej: npm run visual:compare -- antes despues');
	process.exit(1);
}

/** Recorta una imagen al alto/ancho común, para poder comparar dos páginas
 *  de distinto largo sin que la diferencia de tamaño lo ensucie todo. */
const crop = (img, w, h) => {
	const out = new PNG({ width: w, height: h });
	PNG.bitblt(img, out, 0, 0, w, h, 0, 0);
	return out;
};

let worst = 0;

for (const vp of VIEWPORTS) {
	const pathA = join(DIR, `${A}-${vp}.png`);
	const pathB = join(DIR, `${B}-${vp}.png`);
	if (!existsSync(pathA) || !existsSync(pathB)) {
		console.log(`${vp.padEnd(8)} (sin capturas, se saltea)`);
		continue;
	}

	const imgA = PNG.sync.read(readFileSync(pathA));
	const imgB = PNG.sync.read(readFileSync(pathB));
	const w = Math.min(imgA.width, imgB.width);
	const h = Math.min(imgA.height, imgB.height);

	const diff = new PNG({ width: w, height: h });
	const changed = pixelmatch(crop(imgA, w, h).data, crop(imgB, w, h).data, diff.data, w, h, {
		threshold: 0.12,
	});
	const pct = (changed / (w * h)) * 100;
	worst = Math.max(worst, pct);

	writeFileSync(join(DIR, `diff-${vp}.png`), PNG.sync.write(diff));

	console.log(
		`${vp.padEnd(8)} ${imgA.height}px -> ${imgB.height}px | ${changed} px distintos (${pct.toFixed(3)}%)`,
	);

	if (changed === 0) continue;

	// pixelmatch pinta en rojo lo que cambió: contamos rojo por franja.
	const bands = new Map();
	let firstRow = -1;
	for (let y = 0; y < h; y++) {
		let inRow = 0;
		for (let x = 0; x < w; x++) {
			const i = (y * w + x) * 4;
			if (diff.data[i] > 200 && diff.data[i + 1] < 100) inRow++;
		}
		if (inRow > 0) {
			if (firstRow === -1) firstRow = y;
			const k = Math.floor(y / BAND) * BAND;
			bands.set(k, (bands.get(k) ?? 0) + inRow);
		}
	}

	console.log(`         primera fila distinta: y=${firstRow}`);
	const top = [...bands.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	console.log(
		'         franjas: ' + top.map(([y, c]) => `y=${y}-${y + BAND} (${c}px)`).join('  '),
	);
}

console.log(`\nDiff máximo: ${worst.toFixed(3)}%`);
console.log(`Imágenes de diferencia en ${DIR}/diff-*.png — miralas antes de dar nada por bueno.`);
