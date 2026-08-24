/**
 * Textos del acuse automático, por idioma.
 *
 * Viven acá y no en src/locales/*.json a propósito: el mail se renderiza en el
 * servidor, donde i18next no está inicializado. Duplicar cinco frases es más
 * barato que arrastrar el runtime de i18n adentro de la función.
 *
 * Separado de AutoReplyEmail.tsx para que ese archivo exporte SÓLO el
 * componente — es lo que pide react-refresh/only-export-components y lo que
 * necesita el preview server de React Email para descubrirlo.
 */

import type { Locale } from '../lib/contactValidation';

/** Casilla real a la que llegan las respuestas al acuse. El remitente es
 *  no-reply, así que sin esto la persona contesta al vacío. */
export const AUTO_REPLY_TO = 'nahuel.wagner97@gmail.com';

export interface AutoReplyCopy {
	subject: string;
	preview: string;
	eyebrow: string;
	headline: (firstName: string) => string;
	lede: string;
	yourMessage: string;
	cta: string;
	signOff: string;
	role: string;
	footerNote: string;
	noReply: string;
}

export const AUTO_REPLY_COPY: Record<Locale, AutoReplyCopy> = {
	en: {
		subject: "Thanks for reaching out — I'll be in touch",
		preview: 'Your message reached me. I reply within 24 hours.',
		eyebrow: 'Message received',
		headline: (firstName) => `Thanks for reaching out, ${firstName}`,
		lede: "Your message landed in my inbox and I'll get back to you within 24 hours — usually sooner. Below is a copy of what you sent, just so you have it.",
		yourMessage: 'Your message',
		cta: 'See my work',
		signOff: 'Nahuel Wagner',
		role: 'Backend / Full Stack Engineer · Posadas, AR',
		footerNote: 'You received this because you submitted the contact form on',
		noReply: 'Reply to this email and it reaches me directly.',
	},
	es: {
		subject: 'Gracias por escribirme — te respondo en breve',
		preview: 'Tu mensaje me llegó. Respondo dentro de las 24 horas.',
		eyebrow: 'Mensaje recibido',
		headline: (firstName) => `Gracias por escribirme, ${firstName}`,
		lede: 'Tu mensaje llegó a mi casilla y te voy a responder dentro de las próximas 24 horas, normalmente antes. Abajo tenés una copia de lo que enviaste.',
		yourMessage: 'Tu mensaje',
		cta: 'Ver mi trabajo',
		signOff: 'Nahuel Wagner',
		role: 'Backend / Full Stack Engineer · Posadas, AR',
		footerNote: 'Recibís este mail porque completaste el formulario de contacto en',
		noReply: 'Respondé este mail y me llega directo.',
	},
};

/** Asunto del acuse, en el idioma de quien escribió. */
export function autoReplySubject(locale: Locale): string {
	return (AUTO_REPLY_COPY[locale] ?? AUTO_REPLY_COPY.en).subject;
}
