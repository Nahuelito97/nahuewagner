/**
 * Contrato único de validación del formulario de contacto.
 *
 * Lo importan los tres lados para que no se desincronicen:
 *   - el cliente (src/components/Contact.tsx) → maxLength y pre-validación
 *   - el middleware de dev (vite.config.ts)
 *   - la función de servidor (netlify/functions/contact.mts)
 *
 * Sin dependencias ni APIs de runtime: corre igual en Node, Deno y el browser.
 */

/** Valores aceptados en el select "reason". Cualquier otro se rechaza. */
export const REASONS = [
	'Job opportunity',
	'Freelance project',
	'Collaboration',
	'Question',
	'Other',
] as const;

/** Valores aceptados en el select "projectType". Cualquier otro se rechaza. */
export const PROJECT_TYPES = [
	'Backend',
	'Full-stack',
	'Frontend',
	'Mobile',
	'Architecture / consulting',
	'Other',
] as const;

/** Idiomas del sitio (src/i18n.ts). Definen en qué idioma sale el acuse
 *  automático que recibe quien completa el formulario. */
export const LOCALES = ['en', 'es'] as const;

export type Reason = (typeof REASONS)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type Locale = (typeof LOCALES)[number];

/** Límites de longitud. `bodyBytes` corta el request antes de parsear el JSON. */
export const LIMITS = {
	name: { min: 2, max: 80 },
	email: { max: 254 }, // RFC 5321
	message: { min: 10, max: 2000 },
	bodyBytes: 8 * 1024,
} as const;

/**
 * Más estricta que `[^@]+@[^@]+`: exige un TLD alfabético de 2+ caracteres,
 * así "a@b.c" deja de pasar. No pretende cubrir el RFC 5322 entero — para eso
 * está el mail de verificación; esto solo frena basura evidente.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

/**
 * Caracteres de control para campos de UNA sola línea (name, email, reason,
 * projectType). Se eliminan todos, salto de línea incluido: esos valores
 * terminan en el asunto y en cabeceras del mail, donde un salto permite
 * inyectar cabeceras nuevas.
 */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/**
 * Igual que el anterior pero conservando U+000A, el salto de línea.
 * El rango se parte en dos: u0000-u0009 y u000B-u001F, salteando u000A.
 */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_KEEP_NEWLINE = /[\u0000-\u0009\u000B-\u001F\u007F]/g;

export interface CleanContact {
	name: string;
	email: string;
	message: string;
	reason: Reason | '';
	projectType: ProjectType | '';
	/** Idioma en que la persona estaba navegando el sitio. Nunca falla la
	 *  validación por esto: si viene raro o no viene, cae a 'en'. Rechazar un
	 *  contacto real por un locale inválido sería perder un cliente por nada. */
	locale: Locale;
}

export type ValidationResult =
	| { ok: true; data: CleanContact }
	| { ok: false; error: string; field?: string };

/** Honeypot: cualquier valor en `company` delata un bot. */
export function isBot(raw: Record<string, unknown>): boolean {
	return String(raw.company ?? '').trim().length > 0;
}

const clean = (v: unknown): string =>
	typeof v === 'string' ? v.replace(CONTROL_CHARS, '').trim() : '';

/**
 * Limpieza para el CUERPO del mensaje, que sí es multilínea.
 *
 * NO se puede usar `clean` acá: el salto de línea es U+000A y cae dentro del
 * rango de caracteres de control, así que `clean` le borra los párrafos y deja
 * todo el texto pegado en una sola línea. El mensaje va al cuerpo del mail, no
 * a una cabecera, así que el salto es seguro y además necesario.
 *
 * Se normaliza CRLF a LF y se corta en dos saltos seguidos, para que nadie
 * estire el mail con doscientas líneas vacías.
 */
const cleanMultiline = (v: unknown): string => {
	if (typeof v !== 'string') return '';
	return v
		.replace(/\r\n?/g, '\n')
		.replace(CONTROL_CHARS_KEEP_NEWLINE, '')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
};

export function validateContact(raw: unknown): ValidationResult {
	if (typeof raw !== 'object' || raw === null) {
		return { ok: false, error: 'Invalid payload' };
	}
	const body = raw as Record<string, unknown>;

	const name = clean(body.name);
	const email = clean(body.email);
	const message = cleanMultiline(body.message);
	const reason = clean(body.reason);
	const projectType = clean(body.projectType);

	if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) {
		return { ok: false, error: 'Invalid name', field: 'name' };
	}
	if (email.length > LIMITS.email.max || !EMAIL_RE.test(email)) {
		return { ok: false, error: 'Invalid email', field: 'email' };
	}
	if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
		return { ok: false, error: 'Invalid message', field: 'message' };
	}
	// Allowlist: los selects solo aceptan valores conocidos (o vacío, son opcionales).
	if (reason && !(REASONS as readonly string[]).includes(reason)) {
		return { ok: false, error: 'Invalid reason', field: 'reason' };
	}
	if (projectType && !(PROJECT_TYPES as readonly string[]).includes(projectType)) {
		return { ok: false, error: 'Invalid project type', field: 'projectType' };
	}

	// El locale se normaliza, no se valida: "es-AR" → "es", y cualquier cosa
	// desconocida cae a 'en'.
	const rawLocale = clean(body.locale).toLowerCase().split('-')[0];
	const locale = (LOCALES as readonly string[]).includes(rawLocale) ? (rawLocale as Locale) : 'en';

	return {
		ok: true,
		data: {
			name,
			email,
			message,
			reason: reason as Reason | '',
			projectType: projectType as ProjectType | '',
			locale,
		},
	};
}
