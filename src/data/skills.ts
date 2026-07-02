import type { IconType } from 'react-icons';
import generated from '../content/skills.json';
import { icon } from '../lib/icon';

// Administrado por el CMS. La descripción de categoría se muestra vía i18n
// (skills.categories.<key>); acá se conserva por compatibilidad de la interfaz.
export interface Skill {
	name: string;
	icon: IconType;
	color: string;
	primary?: boolean;
}

export interface SkillCategory {
	description: string;
	techs: Skill[];
}

interface CategoryData {
	key: string;
	translations: { es: { description: string }; en: { description: string } };
	skills: {
		name: string;
		iconLib: string;
		iconName: string;
		color: string;
		primary: boolean;
	}[];
}

const skills: Record<string, SkillCategory> = Object.fromEntries(
	(generated as CategoryData[]).map((c) => [
		c.key,
		{
			description: c.translations.es.description,
			techs: c.skills.map((s) => ({
				name: s.name,
				icon: icon(s.iconLib, s.iconName),
				color: s.color,
				primary: s.primary,
			})),
		},
	]),
);

export default skills;
