import { createElement, type ReactNode } from 'react';
import generated from '../content/social.json';

// Administrado por el CMS. El SVG llega como string y se renderiza inline,
// manteniendo la misma forma { href, title, svg } que usa SocialLinks.
export interface SocialLink {
	href: string;
	title: string;
	svg: ReactNode;
}

interface SocialData {
	href: string;
	title: string;
	svg: string;
}

const socialLinksData: SocialLink[] = (generated as SocialData[]).map((s) => ({
	href: s.href,
	title: s.title,
	svg: createElement('span', {
		className: 'inline-flex',
		dangerouslySetInnerHTML: { __html: s.svg },
	}),
}));

export default socialLinksData;
