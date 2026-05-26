import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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
			{
				// Mirrors the Netlify edge function (netlify/edge-functions/contact.ts)
				// during `npm run dev` so the contact form works end-to-end locally
				// without needing the `netlify dev` CLI.
				name: 'dev-api-contact',
				apply: 'serve',
				configureServer(server) {
					server.middlewares.use('/api/contact', async (req, res, next) => {
						if (req.method !== 'POST') return next();
						res.setHeader('Content-Type', 'application/json');

						try {
							const chunks: Buffer[] = [];
							for await (const chunk of req) chunks.push(chunk as Buffer);
							const raw = Buffer.concat(chunks).toString('utf8');
							const parsed = raw ? JSON.parse(raw) : {};

							// Honeypot: silently drop bot submissions (200 so they don't retry).
							if (String(parsed.company ?? '').trim()) {
								res.statusCode = 200;
								return res.end(JSON.stringify({ ok: true }));
							}

							const name = String(parsed.name ?? '').trim();
							const email = String(parsed.email ?? '').trim();
							const message = String(parsed.message ?? '').trim();

							if (!name || !email || !message) {
								res.statusCode = 400;
								return res.end(JSON.stringify({ error: 'Missing required fields' }));
							}
							if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
								res.statusCode = 400;
								return res.end(JSON.stringify({ error: 'Invalid email' }));
							}

							const apiKey = process.env.RESEND_API_KEY;
							if (!apiKey) {
								res.statusCode = 500;
								return res.end(
									JSON.stringify({ error: 'RESEND_API_KEY not set in .env' }),
								);
							}

							const { Resend } = await import('resend');
							const resend = new Resend(apiKey);
							const from = process.env.RESEND_FROM ?? 'Portfolio <onboarding@resend.dev>';
							const to = process.env.RESEND_TO ?? 'nahuel.wagner97@gmail.com';

							const reason = String(parsed.reason ?? '').trim();
							const projectType = String(parsed.projectType ?? '').trim();
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

							const { error } = await resend.emails.send({
								from,
								to,
								subject,
								text,
							});

							if (error) {
								console.error('[dev-api-contact] resend error', error);
								res.statusCode = 502;
								return res.end(JSON.stringify({ error: 'Send failed' }));
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
						if (id.includes('node_modules/@headlessui')) return 'headlessui';
						if (id.includes('node_modules/framer-motion')) return 'motion';
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
