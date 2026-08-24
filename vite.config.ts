import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { LIMITS, isBot, validateContact } from './src/lib/contactValidation';
import { checkRateLimit, clientIpFromHeaders } from './src/lib/rateLimit';
import { renderAutoReplyEmail, renderContactEmail } from './src/emails/render';
import { AUTO_REPLY_TO } from './src/emails/autoReplyCopy';

// Inyecta el SEO administrado desde el CMS (entradas seo.* de src/content/copy.json,
// generadas por scripts/fetch-content.mjs) en el <head> del index.html.
function injectSeo(): Plugin {
	const esc = (s: string) =>
		s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	return {
		name: 'inject-seo',
		transformIndexHtml(html) {
			const file = join(process.cwd(), 'src', 'content', 'copy.json');
			if (!existsSync(file)) return html;
			const copy = JSON.parse(readFileSync(file, 'utf8')) as {
				key: string;
				translations: { en?: string };
			}[];
			const get = (key: string) => copy.find((c) => c.key === key)?.translations?.en;
			const title = get('seo.title');
			const description = get('seo.description');
			const ogDescription = get('seo.ogDescription') ?? description;
			const ogImage = get('seo.ogImage');

			let out = html;
			if (title) {
				const t = esc(title);
				out = out
					.replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
					.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${t}$2`)
					.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${t}$2`);
			}
			if (description) {
				out = out.replace(
					/(<meta\s+name="description"\s+content=")[^"]*(")/,
					`$1${esc(description)}$2`,
				);
			}
			if (ogDescription) {
				const d = esc(ogDescription);
				out = out
					.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${d}$2`)
					.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${d}$2`);
			}
			if (ogImage) {
				const i = esc(ogImage);
				out = out
					.replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${i}$2`)
					.replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, `$1${i}$2`);
			}
			return out;
		},
	};
}

export default defineConfig(({ mode }) => {
	// Expose non-VITE_ env vars (Resend creds, etc.) to the dev middleware below.
	const env = loadEnv(mode, process.cwd(), '');
	for (const key of ['RESEND_API_KEY', 'RESEND_FROM', 'RESEND_TO']) {
		const v = env[key];
		if (v && !process.env[key]) process.env[key] = v;
	}

	return {
		// Build-time constant injected into the bundle. The footer reads this to show
		// "Updated YYYY-MM-DD", proving the site isn't dormant.
		define: {
			__BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
		},
		plugins: [
			react(),
			injectSeo(),
			{
				// Espeja el Netlify Function (netlify/functions/contact.mts)
				// during `npm run dev` so the contact form works end-to-end locally
				// without needing the `netlify dev` CLI.
				name: 'dev-api-contact',
				apply: 'serve',
				configureServer(server) {
					server.middlewares.use('/api/contact', async (req, res, next) => {
						if (req.method !== 'POST') return next();
						res.setHeader('Content-Type', 'application/json');

						// Rate limit ANTES de leer el body: rechazar temprano es
						// rechazar barato, y evita gastar memoria en un request
						// que igual se va a descartar.
						const ip = clientIpFromHeaders(
							(name) => {
								const v = req.headers[name];
								return Array.isArray(v) ? v[0] : v;
							},
							req.socket.remoteAddress ?? 'unknown',
						);
						const limit = checkRateLimit(ip);
						if (!limit.allowed) {
							res.statusCode = 429;
							res.setHeader('Retry-After', String(limit.retryAfterSeconds));
							return res.end(
								JSON.stringify({
									error: 'Too many messages. Please try again later.',
									retryAfter: limit.retryAfterSeconds,
								}),
							);
						}

						try {
							// Se corta la lectura apenas se pasa el límite: el body nunca
							// se acumula entero en memoria, así un POST gigante no llega
							// ni a parsearse.
							const chunks: Buffer[] = [];
							let bytes = 0;
							for await (const chunk of req) {
								bytes += (chunk as Buffer).length;
								if (bytes > LIMITS.bodyBytes) {
									res.statusCode = 413;
									return res.end(JSON.stringify({ error: 'Payload too large' }));
								}
								chunks.push(chunk as Buffer);
							}
							const raw = Buffer.concat(chunks).toString('utf8');
							const parsed = raw ? JSON.parse(raw) : {};

							// Honeypot: silently drop bot submissions (200 so they don't retry).
							if (isBot(parsed)) {
								res.statusCode = 200;
								return res.end(JSON.stringify({ ok: true }));
							}

							const result = validateContact(parsed);
							if (!result.ok) {
								res.statusCode = 400;
								return res.end(JSON.stringify({ error: result.error }));
							}
							const { email } = result.data;

							const apiKey = process.env.RESEND_API_KEY;
							if (!apiKey) {
								res.statusCode = 500;
								return res.end(
									JSON.stringify({ error: 'RESEND_API_KEY not set in .env' }),
								);
							}

							const { Resend } = await import('resend');
							const resend = new Resend(apiKey);
							// `??` no alcanza: un `.env` con `RESEND_TO=` inyecta un
							// string VACÍO, que no es nullish y llega vacío a Resend.
							const envVar = (name: string, fallback: string) => {
								const v = process.env[name]?.trim();
								return v ? v : fallback;
							};
							const from = envVar('RESEND_FROM', 'Portfolio <onboarding@resend.dev>');
							const to = envVar('RESEND_TO', 'nahuel.wagner97@gmail.com');

							// 1) La notificación interna define el resultado del request:
							//    si falla, el contacto se perdió y hay que avisar.
							const { subject, html, text } = await renderContactEmail(result.data);
							const { error } = await resend.emails.send({
								from,
								to,
								subject,
								html,
								text,
								// Sin esto, "Responder" contesta al remitente de Resend
								// en vez de a la persona que escribió.
								replyTo: email,
							});

							if (error) {
								console.error('[dev-api-contact] resend error', error);
								res.statusCode = 502;
								return res.end(JSON.stringify({ error: 'Send failed' }));
							}

							// 2) El acuse al visitante es secundario: su fallo NO tumba
							//    el request, porque el mensaje ya llegó a destino.
							try {
								const auto = await renderAutoReplyEmail(result.data);
								const { error: autoError } = await resend.emails.send({
									from,
									to: email,
									subject: auto.subject,
									html: auto.html,
									text: auto.text,
									replyTo: envVar('RESEND_TO', AUTO_REPLY_TO),
								});
								if (autoError) {
									console.error('[dev-api-contact] auto-reply error', autoError);
								}
							} catch (autoErr) {
								console.error('[dev-api-contact] auto-reply crash', autoErr);
							}

							res.statusCode = 200;
							res.end(JSON.stringify({ ok: true }));
						} catch (err) {
							console.error('[dev-api-contact] crash', err);
							res.statusCode = 500;
							res.end(JSON.stringify({ error: 'Dev handler error' }));
						}
					});
				},
			},
		],
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (!id.includes('node_modules')) return undefined;
						if (id.includes('node_modules/react-icons')) return 'icons';
						if (
							id.includes('node_modules/react-i18next') ||
							id.includes('node_modules/i18next')
						)
							return 'i18n';
						// @headlessui y framer-motion NO se fuerzan a un chunk propio: un manualChunk
						// los fusionaría con sus partes cargadas async (palette, motion features)
						// y volverían al path eager.
						if (
							id.includes('node_modules/react-dom') ||
							id.includes('node_modules/scheduler') ||
							/node_modules\/react\/(?!.*react-)/.test(id)
						)
							return 'react';
						return undefined;
					},
				},
			},
		},
	};
});
