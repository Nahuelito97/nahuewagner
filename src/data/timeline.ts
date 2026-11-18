import generated from '../content/timeline.json';

// Administrado por el CMS. Texto (role/company/duration/type/details/headline/
// achievements) vía i18n experience.entries.<id>.*.
export type TimelineId = string;

export interface TimelineEntry {
	id: TimelineId;
	current?: boolean;
	tech: string[];
	logo?: string;
	/** Año de inicio, para el sello de fecha del canal izquierdo. */
	startYear: number;
}

interface TimelineData {
	id: string;
	current?: boolean;
	tech: string[];
	logo?: string | null;
	translations?: Record<string, { duration?: string } | undefined>;
}

/**
 * Año de inicio a partir de la duración, p. ej. "Sep 2020 – Present".
 *
 * Se lee SIEMPRE la traducción en inglés: el año que muestra la tarjeta no
 * puede depender del idioma que eligió el visitante, y el formato en inglés es
 * el único estable entre bundles. Si no matchea devuelve 0 y la tarjeta
 * simplemente no muestra año, en vez de romper el render.
 */
function parseStartYear(duration: string | undefined): number {
	const m = /[A-Za-z]{3}[a-z]*\s+(\d{4})/.exec(duration ?? '');
	return m ? Number(m[1]) : 0;
}

// Los roles en curso (current) van primero. Dentro de cada grupo se respeta el
// orden del CMS: Array.prototype.sort es estable, así que el snapshot generado
// define la secuencia pero no la prioridad.
const timeline: TimelineEntry[] = (generated as TimelineData[])
	.map((t) => ({
		id: t.id,
		current: t.current,
		tech: t.tech,
		logo: t.logo ?? undefined,
		startYear: parseStartYear(t.translations?.en?.duration),
	}))
	.sort((a, b) => Number(b.current ?? false) - Number(a.current ?? false));

export default timeline;
