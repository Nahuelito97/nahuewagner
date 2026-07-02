import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import copyData from './content/copy.json';
import portfolioData from './content/portfolio.json';
import servicesData from './content/services.json';
import skillsData from './content/skills.json';
import timelineData from './content/timeline.json';
import en from './locales/en.json';
import es from './locales/es.json';

type Lang = 'en' | 'es';
type Bundle = Record<string, unknown>;

interface Translatable {
	id?: string;
	key?: string;
	translations?: Partial<Record<Lang, unknown>>;
}

// setea un valor en una ruta con puntos: "hero.iBuild" -> obj.hero.iBuild
function setDeep(obj: Bundle, path: string, value: unknown): void {
	const parts = path.split('.');
	let node = obj;
	for (let i = 0; i < parts.length - 1; i++) {
		const k = parts[i] as string;
		if (typeof node[k] !== 'object' || node[k] === null) node[k] = {};
		node = node[k] as Bundle;
	}
	node[parts[parts.length - 1] as string] = value;
}

function setIn(obj: Bundle, path: string[], value: unknown): void {
	let node = obj;
	for (let i = 0; i < path.length - 1; i++) {
		const k = path[i] as string;
		if (typeof node[k] !== 'object' || node[k] === null) node[k] = {};
		node = node[k] as Bundle;
	}
	node[path[path.length - 1] as string] = value;
}

// El CMS es la autoridad del contenido: superpone todo lo que venga del API
// sobre el bundle base de cada idioma (que queda como fallback).
function buildBundle(base: Bundle, lang: Lang): Bundle {
	const out = structuredClone(base);

	// textos sueltos (copy)
	for (const c of copyData as Translatable[]) {
		if (c.key && c.translations?.[lang] !== undefined) {
			setDeep(out, c.key, c.translations[lang]);
		}
	}
	// proyectos
	for (const p of portfolioData as Translatable[]) {
		if (p.id && p.translations?.[lang]) {
			setIn(out, ['portfolio', 'projects', p.id], p.translations[lang]);
		}
	}
	// experiencia
	for (const t of timelineData as Translatable[]) {
		if (t.id && t.translations?.[lang]) {
			setIn(out, ['experience', 'entries', t.id], t.translations[lang]);
		}
	}
	// servicios
	for (const s of servicesData as Translatable[]) {
		if (s.id && s.translations?.[lang]) {
			setIn(out, ['services', 'list', s.id], s.translations[lang]);
		}
	}
	// categorías de skills (description string)
	for (const cat of skillsData as (Translatable & {
		translations?: Partial<Record<Lang, { description?: string }>>;
	})[]) {
		const desc = cat.key ? cat.translations?.[lang]?.description : undefined;
		if (cat.key && desc !== undefined) {
			setIn(out, ['skills', 'categories', cat.key], desc);
		}
	}

	return out;
}

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: buildBundle(en as unknown as Bundle, 'en') },
			es: { translation: buildBundle(es as unknown as Bundle, 'es') },
		},
		fallbackLng: 'en',
		supportedLngs: ['en', 'es'],
		interpolation: { escapeValue: false },
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
		},
		returnObjects: true,
	});

export default i18n;
