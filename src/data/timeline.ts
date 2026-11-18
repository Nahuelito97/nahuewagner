import generated from '../content/timeline.json';

// Administrado por el CMS. Texto (role/company/duration/type/details/headline/
// achievements) vía i18n experience.entries.<id>.*.
export type TimelineId = string;

export interface TimelineEntry {
	id: TimelineId;
	current?: boolean;
	tech: string[];
	logo?: string;
}

interface TimelineData {
	id: string;
	current?: boolean;
	tech: string[];
	logo?: string | null;
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
	}))
	.sort((a, b) => Number(b.current ?? false) - Number(a.current ?? false));

export default timeline;
