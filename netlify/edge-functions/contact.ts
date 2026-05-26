/**
 * Netlify Edge Function: receives the contact form POST and sends the message
 * via Resend. Mapped to /api/contact in netlify.toml.
 *
 * Env vars (set in Netlify → Site settings → Environment variables):
 *   RESEND_API_KEY  — required, your Resend secret key
 *   RESEND_FROM     — optional, defaults to onboarding@resend.dev (Resend test sender)
 *   RESEND_TO       — optional, defaults to nahuel.wagner97@gmail.com
 */

import { Resend } from 'resend';

// Inline declaration: avoids pulling @netlify/edge-functions just for the global type.
declare const Netlify: { env: { get: (name: string) => string | undefined } };

interface Body {
	name?: string;
	email?: string;
	message?: string;
	reason?: string;
	projectType?: string;
	/** Honeypot — if a non-empty value comes in, it's a bot. */
	company?: string;
}

const json = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

export default async (req: Request): Promise<Response> => {
	if (req.method !== 'POST') {
		return json({ error: 'Method Not Allowed' }, 405);
	}

	let body: Body;
	try {
		body = (await req.json()) as Body;
	} catch {
		return json({ error: 'Invalid JSON' }, 400);
	}

	// Honeypot: if the hidden "company" field has any value, it's almost certainly a bot.
	// Return 200 so the bot thinks it succeeded and doesn't retry.
	if (body.company?.trim()) {
		return json({ ok: true });
	}

	const name = body.name?.trim() ?? '';
	const email = body.email?.trim() ?? '';
	const message = body.message?.trim() ?? '';

	if (!name || !email || !message) {
		return json({ error: 'Missing required fields' }, 400);
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ error: 'Invalid email' }, 400);
	}

	const apiKey = Netlify.env.get('RESEND_API_KEY');
	if (!apiKey) {
		return json({ error: 'Resend not configured' }, 500);
	}

	const from = Netlify.env.get('RESEND_FROM') ?? 'Portfolio <onboarding@resend.dev>';
	const to = Netlify.env.get('RESEND_TO') ?? 'nahuel.wagner97@gmail.com';

	const reason = body.reason?.trim();
	const projectType = body.projectType?.trim();
	const subject = reason
		? `Portfolio contact — ${reason} — ${name}`
		: `Portfolio contact — ${name}`;
	const text = [
		`From: ${name} <${email}>`,
		reason ? `Reason: ${reason}` : null,
		projectType ? `Project type: ${projectType}` : null,
		'',
		message,
	]
		.filter((line) => line !== null)
		.join('\n');

	const resend = new Resend(apiKey);
	try {
		const { error } = await resend.emails.send({
			from,
			to,
			subject,
			text,
		});
		if (error) {
			console.error('[contact] resend error', error);
			return json({ error: 'Send failed' }, 502);
		}
		return json({ ok: true });
	} catch (err) {
		console.error('[contact] unexpected error', err);
		return json({ error: 'Send failed' }, 500);
	}
};
