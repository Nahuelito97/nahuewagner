/**
 * Endpoint del formulario de contacto: recibe el POST y manda el mail por Resend.
 *
 * Es un Netlify FUNCTION (Node), no un Edge Function (Deno). El motivo: la
 * plantilla usa React Email, que necesita react-dom/server. Meter React en un
 * runtime Deno de edge suma peso de bundle y cold start para un endpoint que se
 * llama unas pocas veces por día. Node además es el mismo runtime que va a
 * correr en el server propio, así que este archivo se muda casi tal cual.
 *
 * La ruta la declara `config.path` de abajo — no hace falta redirect en netlify.toml.
 *
 * Variables de entorno (Netlify → Site settings → Environment variables):
 *   RESEND_API_KEY  — obligatoria
 *   RESEND_FROM     — opcional, default onboarding@resend.dev (remitente de prueba)
 *   RESEND_TO       — opcional, default nahuel.wagner97@gmail.com
 */

import type { Config } from '@netlify/functions';
import { Resend } from 'resend';
import { LIMITS, isBot, validateContact } from '../../src/lib/contactValidation';
import { checkRateLimit, clientIpFromHeaders } from '../../src/lib/rateLimit';
import { autoReplyEnabled } from '../../src/lib/autoReply';
import { renderAutoReplyEmail, renderContactEmail } from '../../src/emails/render';
import { AUTO_REPLY_TO } from '../../src/emails/autoReplyCopy';

/**
 * Lee una variable de entorno tratando "" y "   " como ausentes.
 *
 * NO usar `process.env.X ?? default`: `??` sólo cae al default con null o
 * undefined, y un `.env` con `RESEND_TO=` (sin valor) inyecta un string VACÍO,
 * que pasa el `??` y llega vacío a Resend → 422 "Invalid `to` field".
 */
const env = (name: string, fallback: string): string => {
	const v = process.env[name]?.trim();
	return v ? v : fallback;
};

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
	new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});

export default async (req: Request): Promise<Response> => {
	if (req.method !== 'POST') {
		return json({ error: 'Method Not Allowed' }, 405);
	}

	// Rate limit primero: rechazar antes de leer el body es lo más barato.
	const ip = clientIpFromHeaders((name) => req.headers.get(name));
	const limit = checkRateLimit(ip);
	if (!limit.allowed) {
		return json(
			{ error: 'Too many messages. Please try again later.', retryAfter: limit.retryAfterSeconds },
			429,
			{ 'Retry-After': String(limit.retryAfterSeconds) },
		);
	}

	// Corte por tamaño antes de parsear. Content-Length es una pista que el
	// cliente puede mentir, así que después se vuelve a medir el body real.
	const declared = Number(req.headers.get('content-length') ?? 0);
	if (declared > LIMITS.bodyBytes) {
		return json({ error: 'Payload too large' }, 413);
	}

	const raw = await req.text();
	if (raw.length > LIMITS.bodyBytes) {
		return json({ error: 'Payload too large' }, 413);
	}

	let parsed: unknown;
	try {
		parsed = raw ? JSON.parse(raw) : {};
	} catch {
		return json({ error: 'Invalid JSON' }, 400);
	}

	// Honeypot: se responde 200 para que el bot crea que funcionó y no reintente.
	if (isBot(parsed as Record<string, unknown>)) {
		return json({ ok: true });
	}

	const result = validateContact(parsed);
	if (!result.ok) {
		return json({ error: result.error }, 400);
	}

	const apiKey = env('RESEND_API_KEY', '');
	if (!apiKey) {
		console.error('[contact] RESEND_API_KEY no configurada');
		return json({ error: 'Resend not configured' }, 500);
	}

	const from = env('RESEND_FROM', 'Portfolio <onboarding@resend.dev>');
	const to = env('RESEND_TO', 'nahuel.wagner97@gmail.com');
	const { subject, html, text } = await renderContactEmail(result.data);

	const resend = new Resend(apiKey);

	// 1) La notificación interna va PRIMERO y es la que define el resultado del
	//    request. Si esta falla, el contacto se perdió: hay que devolver error
	//    para que el formulario muestre el fallback con el mail directo.
	try {
		const { error } = await resend.emails.send({
			from,
			to,
			subject,
			html,
			text,
			// Sin esto, "Responder" contesta al remitente de Resend en vez de a
			// la persona que escribió.
			replyTo: result.data.email,
		});
		if (error) {
			console.error('[contact] resend error', error);
			return json({ error: 'Send failed' }, 502);
		}
	} catch (err) {
		console.error('[contact] unexpected error', err);
		return json({ error: 'Send failed' }, 500);
	}

	// 2) El acuse al visitante es SECUNDARIO y su fallo NO puede tumbar el
	//    request: el mensaje ya llegó a destino. Si esto reventara y devolviera
	//    error, la persona vería "no se pudo enviar" y volvería a escribir un
	//    mensaje que en realidad ya recibiste.
	if (!autoReplyEnabled(process.env.CONTACT_AUTO_REPLY)) {
		// Apagado por defecto: manda a una direccion que elige el visitante y el
		// rate limit no es efectivo en serverless. Ver src/lib/autoReply.ts.
		return json({ ok: true });
	}

	try {
		const auto = await renderAutoReplyEmail(result.data);
		const { error } = await resend.emails.send({
			from,
			to: result.data.email,
			subject: auto.subject,
			html: auto.html,
			text: auto.text,
			// El remitente es no-reply, así que responder tiene que llegar a una
			// casilla real.
			replyTo: env('RESEND_TO', AUTO_REPLY_TO),
		});
		if (error) console.error('[contact] auto-reply error (no bloqueante)', error);
	} catch (err) {
		console.error('[contact] auto-reply crash (no bloqueante)', err);
	}

	return json({ ok: true });
};

export const config: Config = {
	path: '/api/contact',
};
