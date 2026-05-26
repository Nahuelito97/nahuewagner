export type TimelineId =
	| 'correoArgentino'
	| 'eimo'
	| 'tutuLead'
	| 'tutuFullStack'
	| 'gearthLogic'
	| 'adsmovil'
	| 'wagnerLabs';

/**
 * All translatable text lives in the locale bundles under
 * `experience.entries.<id>.*` (role, company, duration, type, details,
 * headline, achievements). Set `current: true` on roles still in progress
 * (i18n strings just say "Present" / "Actual" — the UI uses this flag
 * for the pulsing badge instead of substring-matching the duration).
 */
export interface TimelineEntry {
	id: TimelineId;
	current?: boolean;
	tech: string[];
	logo?: string;
}

// Ordered newest start-date first.
const timeline: TimelineEntry[] = [
	{
		id: 'correoArgentino',
		current: true,
		tech: ['NestJS', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
	},
	{
		id: 'eimo',
		current: true,
		tech: ['React', 'TypeScript', 'Strapi', 'PostgreSQL', 'Stripe'],
		logo: '/assets/projects/eimo-logo.png',
	},
	{
		id: 'tutuLead',
		tech: ['NestJS', 'React', 'Firebase', 'AWS'],
		logo: '/assets/projects/tutu-logo.webp',
	},
	{
		id: 'tutuFullStack',
		tech: ['NestJS', 'React', 'Firebase', 'MercadoPago', 'AWS SES'],
		logo: '/assets/projects/tutu-logo.webp',
	},
	{
		id: 'gearthLogic',
		current: true,
		tech: ['NestJS', 'React', 'Strapi', 'Laravel', 'PostgreSQL', 'TailwindCSS'],
		logo: '/assets/projects/gearth.webp',
	},
	{
		id: 'adsmovil',
		tech: ['Laravel', 'MySQL', 'PHP'],
	},
	{
		id: 'wagnerLabs',
		current: true,
		tech: ['NestJS', 'React', 'Laravel', 'PostgreSQL', 'Docker'],
	},
];

export default timeline;
