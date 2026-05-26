export type ProjectId =
	| 'apiMonitor'
	| 'eimoCampus'
	| 'tribuSaludable'
	| 'tutu'
	| 'jennyGas'
	| 'gearthCrm'
	| 'powerStaffing'
	| 'nodePermissions'
	| 'personal';

export type ProjectCategoryKey = 'fullstack' | 'backend' | 'oss';
export type ProjectTagKey = 'flagship' | 'production' | 'sideProject' | 'openSource';

/**
 * All translatable text lives in the locale bundles under
 * `portfolio.projects.<id>.*` (title, tagline, description, year, role,
 * highlights, problem, solution, outcomes, myRole, team, linkLabel).
 */
export interface Project {
	id: ProjectId;
	category: ProjectCategoryKey;
	tag?: ProjectTagKey;
	stack: string[];
	link?: string;
	sourceCodeLink?: string;
	featured?: boolean;
	imgUrl?: string;
	modalImage?: string;
	logo?: string;
}

const portfolio: Project[] = [
	{
		id: 'apiMonitor',
		category: 'fullstack',
		tag: 'flagship',
		stack: ['nestjs', 'typescript', 'postgresql', 'redis', 'nextjs', 'docker'],
		featured: true,
	},
	{
		id: 'eimoCampus',
		category: 'fullstack',
		tag: 'production',
		stack: ['react', 'typescript', 'strapi', 'postgresql', 'stripe'],
		featured: true,
		imgUrl: '/assets/projects/eimo.webp',
		logo: '/assets/projects/eimo-logo.png',
	},
	{
		id: 'tribuSaludable',
		category: 'fullstack',
		tag: 'production',
		stack: ['react', 'typescript', 'strapi', 'postgresql', 'stripe'],
		featured: true,
		modalImage: '/assets/projects/tribu-coach.webp',
		logo: '/assets/projects/tribu-logo.webp',
	},
	{
		id: 'tutu',
		category: 'backend',
		tag: 'production',
		stack: ['nestjs', 'typescript', 'postgresql', 'redis', 'aws', 'docker'],
		imgUrl: '/assets/projects/tutu.webp',
		logo: '/assets/projects/tutu-logo.webp',
	},
	{
		id: 'jennyGas',
		category: 'fullstack',
		tag: 'production',
		stack: ['flutter', 'nestjs', 'typescript', 'postgresql', 'firebase'],
		link: 'https://gearth-admin.web.app',
		modalImage: '/assets/projects/jennygas-app.webp',
		logo: '/assets/projects/jennygas-logo.webp',
	},
	{
		id: 'gearthCrm',
		category: 'fullstack',
		tag: 'sideProject',
		stack: ['nestjs', 'react', 'typescript', 'postgresql', 'twilio'],
		link: 'https://gearth-admin.web.app',
		sourceCodeLink: 'https://github.com/Nahuelito97/gearth-admin',
		logo: '/assets/projects/gearth.webp',
		imgUrl: '/assets/projects/gearth-admin.webp',
	},
	{
		id: 'powerStaffing',
		category: 'backend',
		tag: 'production',
		stack: ['nestjs', 'react', 'typescript', 'postgresql'],
		logo: '/assets/projects/powerstaffing-logo.svg',
	},
	{
		id: 'nodePermissions',
		category: 'oss',
		tag: 'openSource',
		stack: ['typescript', 'nestjs', 'nodejs'],
		link: 'https://www.npmjs.com/package/@wagner-labs/node-permissions',
		sourceCodeLink: 'https://github.com/Nahuelito-Dev/node-permissions',
	},
	{
		id: 'personal',
		category: 'fullstack',
		tag: 'sideProject',
		stack: ['react', 'typescript', 'tailwind', 'vite'],
		sourceCodeLink: 'https://github.com/Nahuelito97/nahuewagner',
	},
];

export default portfolio;
