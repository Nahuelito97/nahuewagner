import generated from '../content/portfolio.json';

// El contenido lo administra el CMS (nahuewagner-api). El build hornea
// src/content/portfolio.json vía scripts/fetch-content.mjs. Todo el texto
// traducible (title, tagline, description, year, role, highlights, problem,
// solution, outcomes, myRole, team) se inyecta en los bundles i18n desde
// el mismo JSON (ver src/i18n.ts).

export type ProjectId = string; // dinámico: lo define el CMS
export type ProjectCategoryKey = 'fullstack' | 'backend' | 'oss';
export type ProjectTagKey = 'flagship' | 'production' | 'sideProject' | 'openSource';

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

interface GeneratedProject extends Project {
	order?: number;
	translations?: unknown;
}

const portfolio: Project[] = (generated as unknown as GeneratedProject[]).map((p) => ({
	id: p.id,
	category: p.category,
	tag: p.tag,
	stack: p.stack,
	link: p.link,
	sourceCodeLink: p.sourceCodeLink,
	featured: p.featured,
	imgUrl: p.imgUrl,
	modalImage: p.modalImage,
	logo: p.logo,
}));

export default portfolio;
