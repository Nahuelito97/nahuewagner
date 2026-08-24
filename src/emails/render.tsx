/** @jsxRuntime automatic */
/** @jsxImportSource react */

/**
 * Renderiza el mail de contacto a HTML + texto plano.
 *
 * Separado de ContactEmail.tsx a propósito: ese archivo exporta SOLO el
 * componente, que es lo que espera la regla react-refresh/only-export-components
 * y lo que necesita el preview server de React Email para descubrirlo.
 *
 * El pragma de arriba hace falta porque a este archivo lo compila esbuild al
 * empaquetar vite.config.ts, y ahí no hereda el "jsx" de tsconfig.node.json.
 */

import { render } from '@react-email/render';
import ContactEmail from './ContactEmail';
import AutoReplyEmail from './AutoReplyEmail';
import { autoReplySubject } from './autoReplyCopy';
import { buildSubject } from './subject';
import type { CleanContact } from '../lib/contactValidation';

export interface RenderedEmail {
	subject: string;
	html: string;
	text: string;
}

/**
 * Es async porque `render` de React Email lo es a partir de v2.
 *
 * El texto plano NO sale de `render(el, { plainText: true })`: ese modo aplana
 * el componente entero y arrastra el "NW" del avatar, pega las etiquetas sin
 * separador y escupe la URL cruda del mailto. Para un mail de notificación,
 * cinco líneas escritas a mano se leen mejor que el volcado automático.
 */
export async function renderContactEmail(
	data: CleanContact,
	now: Date = new Date(),
): Promise<RenderedEmail> {
	const { name, email, message, reason, projectType } = data;
	const receivedAt = formatReceivedAt(now);

	const html = await render(<ContactEmail {...data} receivedAt={receivedAt} />);
	const text = [
		`From: ${name} <${email}>`,
		reason ? `Reason: ${reason}` : null,
		projectType ? `Project type: ${projectType}` : null,
		`Received: ${receivedAt}`,
		'',
		message,
		'',
		'—',
		'Sent from the contact form at wagnerlabs.dev',
	]
		.filter((line) => line !== null)
		.join('\n');

	return { subject: buildSubject(name, reason), html, text };
}

/**
 * Acuse automático para QUIEN ESCRIBIÓ, en su idioma.
 *
 * El texto plano se arma a mano por el mismo motivo que el otro: el modo
 * plainText de React Email arrastra la marca y las URLs crudas.
 */
export async function renderAutoReplyEmail(data: CleanContact): Promise<RenderedEmail> {
	const { name, message, locale } = data;
	const firstName = name.split(' ')[0];

	const html = await render(<AutoReplyEmail {...data} />);
	const text =
		locale === 'es'
			? [
					`Hola ${firstName},`,
					'',
					'Recibí tu mensaje y te voy a responder dentro de las próximas 24 horas.',
					'Abajo tenés una copia de lo que enviaste.',
					'',
					'---',
					message,
					'---',
					'',
					'Nahuel Wagner — Backend / Full Stack Engineer',
					'https://wagnerlabs.dev',
					'',
					'Esta casilla no se lee: respondé este mail y me llega directo.',
				].join('\n')
			: [
					`Hi ${firstName},`,
					'',
					"Your message reached me and I'll get back to you within 24 hours.",
					"Below is a copy of what you sent, just so you have it.",
					'',
					'---',
					message,
					'---',
					'',
					'Nahuel Wagner — Backend / Full Stack Engineer',
					'https://wagnerlabs.dev',
					'',
					'This address is unattended: reply to this email and it reaches me directly.',
				].join('\n');

	return { subject: autoReplySubject(locale), html, text };
}

/**
 * Fecha en tu huso, no en el del servidor. Sin esto, un server en UTC te
 * muestra "15:14" para un mensaje que entró a las 12:14 y la notificación
 * miente sobre cuándo pasó.
 */
function formatReceivedAt(d: Date): string {
	const parts = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'America/Argentina/Buenos_Aires',
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).format(d);
	// en-GB devuelve "20 Aug 2026, 12:14"
	return `${parts} (GMT-3)`;
}
