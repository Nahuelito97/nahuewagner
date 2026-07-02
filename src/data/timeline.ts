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

const timeline: TimelineEntry[] = (generated as TimelineData[]).map((t) => ({
	id: t.id,
	current: t.current,
	tech: t.tech,
	logo: t.logo ?? undefined,
}));

export default timeline;
