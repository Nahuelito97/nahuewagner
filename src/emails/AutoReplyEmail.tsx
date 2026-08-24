/** @jsxRuntime automatic */
/** @jsxImportSource react */

/**
 * Acuse automático que recibe QUIEN COMPLETA el formulario.
 *
 * Ojo con la diferencia: ContactEmail.tsx es la notificación interna, la ve
 * Nahue. Este mail lo ve un cliente potencial, y para mucha gente va a ser el
 * primer contacto directo con la marca. Por eso confirma lo que mandó (patrón
 * de acuse: la persona ve que su mensaje llegó completo) y compromete un plazo
 * de respuesta concreto.
 *
 * El pragma de arriba es necesario: a este archivo lo compila esbuild cuando
 * empaqueta vite.config.ts, y en ese paso NO hereda el "jsx" de tsconfig.node.json.
 *
 * Preview local:  npm run email
 */

import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components';
import type { CleanContact } from '../lib/contactValidation';
import { AUTO_REPLY_COPY } from './autoReplyCopy';
import { HERO_COLORS, HERO_IMAGE_URL, SERIF } from './hero';

const C = {
	bg: '#F3EFE9',
	surface: '#FDFCFA',
	outline: '#DDD6E8',
	content: '#2A2547',
	muted: '#6B6577',
	primary: '#F0C38E',
} as const;

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace";
const GUTTER = '40px';

const SITE_URL = 'https://wagnerlabs.dev';

/** Redes como TEXTO: Gmail elimina los <svg> inline. */
const SOCIALS = [
	{ label: 'X', href: 'https://x.com/nahuelitodev' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/nahuewagner/' },
	{ label: 'GitHub', href: 'https://github.com/Nahuelito97' },
];

const RESPONSIVE_CSS = `
	@media only screen and (max-width: 480px) {
		.gutter { padding-left: 22px !important; padding-right: 22px !important; }
		.headline { font-size: 22px !important; }
		.btn { display: block !important; text-align: center !important; }
	}
`;

const styles = {
	body: { backgroundColor: C.bg, margin: 0, padding: '36px 12px', fontFamily: FONT },

	brandBar: { maxWidth: '580px', margin: '0 auto 20px', textAlign: 'center' as const },
	mark: {
		display: 'inline-block',
		width: '36px',
		height: '36px',
		lineHeight: '36px',
		borderRadius: '9px',
		backgroundColor: C.content,
		color: '#FFFFFF',
		fontSize: '13px',
		fontWeight: 700,
		letterSpacing: '0.5px',
		textAlign: 'center' as const,
		margin: 0,
	},
	brandName: {
		fontSize: '12px',
		fontWeight: 600,
		color: C.muted,
		letterSpacing: '0.2px',
		margin: '8px 0 0',
		textAlign: 'center' as const,
	},

	card: {
		width: '100%',
		maxWidth: '580px',
		backgroundColor: C.surface,
		border: `1px solid ${C.outline}`,
		borderRadius: '12px',
		overflow: 'hidden',
	},

	hero: { padding: `40px ${GUTTER} 44px` },
	eyebrow: {
		fontFamily: MONO,
		fontSize: '10px',
		letterSpacing: '1.6px',
		textTransform: 'uppercase' as const,
		color: HERO_COLORS.accent,
		margin: '0 0 14px',
	},
	eyebrowDark: {
		fontFamily: MONO,
		fontSize: '10px',
		letterSpacing: '1.1px',
		textTransform: 'uppercase' as const,
		color: C.muted,
		margin: '0 0 10px',
	},
	headline: {
		fontFamily: SERIF,
		fontSize: '32px',
		fontWeight: 700,
		textTransform: 'uppercase' as const,
		color: HERO_COLORS.fg,
		margin: 0,
		lineHeight: 1.15,
		letterSpacing: '-0.3px',
	},
	lede: { fontSize: '15px', lineHeight: 1.65, color: HERO_COLORS.body, margin: '18px 0 0' },

	// La copia del mensaje va apagada a propósito: es una confirmación, no el
	// contenido principal. Quien lo lee ya sabe lo que escribió.
	messageWrap: { padding: `26px ${GUTTER} 0` },
	quote: { borderLeft: `3px solid ${C.outline}`, paddingLeft: '18px' },
	message: { fontSize: '15px', lineHeight: 1.7, color: C.muted, margin: '0 0 12px' },

	ctaWrap: { padding: `30px ${GUTTER} 0` },
	button: {
		display: 'inline-block',
		padding: '15px 28px',
		backgroundColor: C.primary,
		color: C.content,
		fontSize: '15px',
		fontWeight: 600,
		textDecoration: 'none',
		borderRadius: '8px',
	},

	signature: { padding: `30px ${GUTTER} 36px` },
	signName: { fontSize: '15px', fontWeight: 600, color: C.content, margin: 0 },
	signRole: { fontSize: '13px', color: C.muted, margin: '3px 0 0' },

	footerWrap: { maxWidth: '580px', margin: '0 auto', padding: '22px 16px 0' },
	socialRow: { textAlign: 'center' as const, margin: '0 0 12px' },
	socialLink: { fontSize: '12px', color: C.muted, textDecoration: 'none' },
	socialSep: { fontSize: '12px', color: C.outline },
	footer: {
		fontFamily: MONO,
		fontSize: '10px',
		letterSpacing: '0.3px',
		lineHeight: 1.7,
		color: C.muted,
		textAlign: 'center' as const,
		margin: 0,
	},
};

export type AutoReplyEmailProps = CleanContact;

export function AutoReplyEmail({ name, message, locale }: AutoReplyEmailProps) {
	const t = AUTO_REPLY_COPY[locale] ?? AUTO_REPLY_COPY.en;
	const firstName = name.split(' ')[0];
	const paragraphs = message.split(/\r?\n/).filter((p) => p.trim() !== '');

	// bgcolor/background son atributos HTML viejos que React renderiza pero no
	// tipa, y son los únicos que entiende Outlook para fondos.
	const heroAttrs: Record<string, string> = { bgcolor: HERO_COLORS.bg };
	if (HERO_IMAGE_URL) heroAttrs.background = HERO_IMAGE_URL;

	return (
		<Html lang={locale}>
			<Head>
				<meta name="color-scheme" content="light" />
				<meta name="supported-color-schemes" content="light" />
				<style dangerouslySetInnerHTML={{ __html: RESPONSIVE_CSS }} />
			</Head>
			<Preview>{t.preview}</Preview>
			<Body style={styles.body}>
				<Container style={styles.brandBar}>
					<Text style={styles.mark}>NW</Text>
					<Text style={styles.brandName}>wagnerlabs.dev</Text>
				</Container>

				<Container style={styles.card}>
					{/* Mismo hero a prueba de balas que ContactEmail: color sólido de
					    base y foto opcional encima, para que el titular siga legible
					    aunque el cliente bloquee imágenes. */}
					<table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0}>
						<tbody>
							<tr>
								<td
									{...heroAttrs}
									style={{
										backgroundColor: HERO_COLORS.bg,
										...(HERO_IMAGE_URL
											? {
													backgroundImage: `url(${HERO_IMAGE_URL})`,
													backgroundSize: 'cover',
													backgroundPosition: 'center',
												}
											: {}),
									}}
								>
									<Section className="gutter" style={styles.hero}>
										<Text style={styles.eyebrow}>{t.eyebrow}</Text>
										<Heading as="h1" className="headline" style={styles.headline}>
											{t.headline(firstName)}
										</Heading>
										<Text style={styles.lede}>{t.lede}</Text>
									</Section>
								</td>
							</tr>
						</tbody>
					</table>

					<Section className="gutter" style={styles.messageWrap}>
						<Text style={styles.eyebrowDark}>{t.yourMessage}</Text>
						<Section style={styles.quote}>
							{paragraphs.map((p, i) => (
								<Text
									key={`p-${i}`}
									style={
										i === paragraphs.length - 1
											? { ...styles.message, margin: 0 }
											: styles.message
									}
								>
									{p}
								</Text>
							))}
						</Section>
					</Section>

					<Section className="gutter" style={styles.ctaWrap}>
						<Link href={SITE_URL} className="btn" style={styles.button}>
							{t.cta}
						</Link>
					</Section>

					<Section className="gutter" style={styles.signature}>
						<Text style={styles.signName}>{t.signOff}</Text>
						<Text style={styles.signRole}>{t.role}</Text>
					</Section>
				</Container>

				<Container style={styles.footerWrap}>
					<Section style={styles.socialRow}>
						{SOCIALS.map((s, i) => (
							<span key={s.label}>
								{i > 0 && <span style={styles.socialSep}> &nbsp;·&nbsp; </span>}
								<Link href={s.href} style={styles.socialLink}>
									{s.label}
								</Link>
							</span>
						))}
					</Section>
					<Text style={styles.footer}>
						{t.footerNote}{' '}
						<Link href={SITE_URL} style={{ color: C.muted, textDecoration: 'underline' }}>
							wagnerlabs.dev
						</Link>
						.
						<br />
						{t.noReply}
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

/** Preview de React Email: se muestra con datos de ejemplo. */
AutoReplyEmail.PreviewProps = {
	name: 'Lucía Fernández',
	email: 'lucia@estudioamber.com',
	reason: 'Freelance project',
	projectType: 'Backend',
	locale: 'es',
	message:
		'Hola Nahue, te escribo desde Estudio Amber.\n\nEstamos armando una plataforma de reservas y necesitamos alguien que se haga cargo del backend: NestJS, Postgres y una integración con MercadoPago.\n\n¿Tenés disponibilidad para arrancar en septiembre?',
} satisfies AutoReplyEmailProps;

export default AutoReplyEmail;
