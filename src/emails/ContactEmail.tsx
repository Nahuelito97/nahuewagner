/** @jsxRuntime automatic */
/** @jsxImportSource react */

/**
 * Mail que llega cuando alguien completa el formulario de contacto.
 *
 * El pragma de arriba es necesario: a este archivo lo compila esbuild cuando
 * empaqueta vite.config.ts, y en ese paso NO hereda el "jsx": "react-jsx" de
 * tsconfig.node.json — cae al transform clásico y revienta con
 * "React is not defined". El pragma se lo dice por archivo.
 *
 * Escrito con React Email: el JSX se compila a HTML con tablas y estilos inline,
 * que es lo único que interpretan bien Gmail y Outlook. El texto plano lo arma
 * render.tsx a mano (ver el porqué ahí).
 *
 * ESTRUCTURA — la de un mail de bienvenida, aplicada a una notificación:
 *   marca centrada arriba → un titular → un párrafo corto → los datos →
 *   el mensaje → UN botón → pie con contacto y redes.
 * La regla que ordena todo es la contención: un mensaje, un botón, un acento.
 *
 * POR QUÉ TEMA CLARO Y NO EL OSCURO DEL SITIO:
 * un mail de notificación no es una landing. Varios clientes fuerzan modo claro
 * e invierten los colores por su cuenta, con resultados impredecibles; al
 * reenviar una consulta a un tercero el bloque oscuro rompe el hilo; y al
 * imprimir o pasar a PDF queda inservible. Los colores salen igual de
 * src/styles/tailwind.css, sólo que de la paleta `html.light`.
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
import { buildSubject } from './subject';
import { HERO_COLORS, HERO_IMAGE_URL, SERIF } from './hero';

/** Paleta clara del portfolio (html.light en src/styles/tailwind.css), en hex:
 *  los clientes de correo no resuelven variables CSS ni rgb(x y z). */
const C = {
	bg: '#F3EFE9', // --c-bg
	surface: '#FDFCFA', // --c-surface, apenas apagado a propósito (ver nota de modo oscuro)
	outline: '#DDD6E8', // --c-outline
	content: '#2A2547', // --c-content
	muted: '#6B6577', // --c-content-muted
	primary: '#F0C38E', // --c-primary — RESERVADO para el botón, nada más
} as const;

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace";

/** 580px es el ancho seguro clásico: entra en el panel de lectura de Outlook
 *  sin scroll horizontal. El canal lateral se achica en mobile por media query. */
const GUTTER = '40px';

const SITE_URL = 'https://wagnerlabs.dev';
/** Redes como TEXTO, no como íconos: Gmail elimina los <svg> inline, y meter
 *  PNGs obligaría a hostearlos y a que el cliente acepte cargar imágenes. */
const SOCIALS = [
	{ label: 'X', href: 'https://x.com/nahuelitodev' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/nahuewagner/' },
	{ label: 'GitHub', href: 'https://github.com/Nahuelito97' },
];

/**
 * Los estilos inline ganan siempre, así que el ajuste mobile va por media query
 * con !important. Es feo, pero es la única forma de sobreescribir un style inline
 * en un cliente de correo — y sin esto, con 40px de canal a cada lado, en una
 * pantalla de 320px quedan 240px útiles.
 */
const RESPONSIVE_CSS = `
	@media only screen and (max-width: 480px) {
		.gutter { padding-left: 22px !important; padding-right: 22px !important; }
		.meta-label {
			display: block !important;
			width: auto !important;
			padding: 0 0 2px 0 !important;
		}
		.meta-value { display: block !important; padding: 0 0 12px 0 !important; }
		.headline { font-size: 22px !important; }
		.btn { display: block !important; text-align: center !important; }
	}
`;

const styles = {
	body: { backgroundColor: C.bg, margin: 0, padding: '36px 12px', fontFamily: FONT },

	// Marca centrada por encima de la tarjeta: el gesto típico del mail de
	// bienvenida. Ubica de quién es el mensaje antes de leer una palabra.
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

	// Bloque héroe: banda oscura a sangre con el titular en mayúsculas y serif.
	// Es lo primero que se ve y entra entero en los primeros 300px.
	hero: { padding: `40px ${GUTTER} 44px` },
	eyebrow: {
		fontFamily: MONO,
		fontSize: '10px',
		letterSpacing: '1.6px',
		textTransform: 'uppercase' as const,
		color: HERO_COLORS.accent,
		margin: '0 0 14px',
	},
	headline: {
		fontFamily: SERIF,
		fontSize: '34px',
		fontWeight: 700,
		textTransform: 'uppercase' as const,
		color: HERO_COLORS.fg,
		margin: 0,
		lineHeight: 1.15,
		letterSpacing: '-0.3px',
	},
	// Un párrafo, tres o cuatro líneas. Ni una más.
	lede: { fontSize: '15px', lineHeight: 1.65, color: HERO_COLORS.body, margin: '18px 0 0' },
	emailLink: { fontFamily: MONO, fontSize: '13px', color: C.muted, textDecoration: 'none' },

	// Metadatos con etiquetas alineadas: lo que separa un mail transaccional
	// ordenado de uno improvisado.
	eyebrowDark: {
		fontFamily: MONO,
		fontSize: '10px',
		letterSpacing: '1.1px',
		textTransform: 'uppercase' as const,
		color: C.muted,
		margin: '0 0 10px',
	},

	metaWrap: { padding: `28px ${GUTTER} 0` },
	metaCard: { backgroundColor: C.bg, borderRadius: '8px', padding: '16px 18px' },
	metaTable: { width: '100%', borderCollapse: 'collapse' as const },
	metaLabel: {
		fontFamily: MONO,
		fontSize: '10px',
		letterSpacing: '1.1px',
		textTransform: 'uppercase' as const,
		color: C.muted,
		padding: '0 16px 9px 0',
		verticalAlign: 'top' as const,
		whiteSpace: 'nowrap' as const,
		width: '92px',
	},
	metaValue: {
		fontSize: '14px',
		color: C.content,
		fontWeight: 500,
		padding: '0 0 9px',
		verticalAlign: 'top' as const,
	},

	// Filete NEUTRO, no de acento: el durazno quedó sólo para el botón. Si el
	// mismo color brillante está en tres lugares, el CTA pierde prioridad.
	messageWrap: { padding: `26px ${GUTTER} 0` },
	quote: { borderLeft: `3px solid ${C.outline}`, paddingLeft: '18px' },
	message: { fontSize: '16px', lineHeight: 1.7, color: C.content, margin: '0 0 12px' },

	// UN botón. 47px de alto: el mínimo táctil recomendado es 44.
	ctaWrap: { padding: `30px ${GUTTER} 36px` },
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

	// Pie con contacto y redes, como el de un mail de bienvenida.
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

export interface ContactEmailProps extends CleanContact {
	/** Momento de recepción, ya formateado. Se inyecta en vez de calcularlo acá
	 *  para que el componente sea puro y el preview dé siempre lo mismo. */
	receivedAt?: string;
}

function MetaRow({ label, value }: { label: string; value: string }) {
	return (
		<tr>
			<td className="meta-label" style={styles.metaLabel}>
				{label}
			</td>
			<td className="meta-value" style={styles.metaValue}>
				{value}
			</td>
		</tr>
	);
}

export function ContactEmail({
	name,
	email,
	message,
	reason,
	projectType,
	receivedAt,
}: ContactEmailProps) {
	const firstName = name.split(' ')[0];
	const subject = buildSubject(name, reason);
	// Se descartan las líneas vacías: el espaciado lo da el margen del <Text>,
	// no párrafos fantasma.
	const paragraphs = message.split(/\r?\n/).filter((p) => p.trim() !== '');

	// `bgcolor` y `background` son atributos HTML de los 90 que React sí
	// renderiza pero que sus tipos no declaran. Son justamente los que entiende
	// Outlook, que ignora el CSS de fondo. Por eso se arman aparte y se
	// esparcen: el tipo Record evita pelear con las definiciones de React.
	const heroAttrs: Record<string, string> = { bgcolor: HERO_COLORS.bg };
	if (HERO_IMAGE_URL) heroAttrs.background = HERO_IMAGE_URL;

	return (
		<Html lang="en">
			<Head>
				{/* Se declara tema claro: sin esto, los clientes en modo oscuro
				    invierten los colores por su cuenta y arruinan el contraste. */}
				<meta name="color-scheme" content="light" />
				<meta name="supported-color-schemes" content="light" />
				<style dangerouslySetInnerHTML={{ __html: RESPONSIVE_CSS }} />
			</Head>
			{/* Línea que Gmail muestra en la bandeja antes de abrir el mail. */}
			<Preview>{`${name} · ${message.slice(0, 90)}`}</Preview>
			<Body style={styles.body}>
				<Container style={styles.brandBar}>
					<Text style={styles.mark}>NW</Text>
					<Text style={styles.brandName}>wagnerlabs.dev</Text>
				</Container>

				<Container style={styles.card}>
					{/*
					  Hero a prueba de balas: `bgcolor` lleva el violeta sólido y
					  `background` la foto opcional. Si el cliente bloquea imágenes
					  —Outlook y Gmail lo hacen por defecto— queda el color y el
					  titular blanco sigue legible. Nunca poner texto que dependa
					  de que una imagen cargue.
					*/}
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
										<Text style={styles.eyebrow}>New enquiry</Text>
										<Heading as="h1" className="headline" style={styles.headline}>
											{`${firstName} wants to get in touch`}
										</Heading>
										<Text style={styles.lede}>
											Someone just reached out through the contact form on your
											portfolio. The full message is below, along with everything
											you need to reply.
										</Text>
									</Section>
								</td>
							</tr>
						</tbody>
					</table>

					<Section className="gutter" style={styles.metaWrap}>
						<Section style={styles.metaCard}>
							<table role="presentation" style={styles.metaTable} cellPadding={0} cellSpacing={0}>
								<tbody>
									<MetaRow label="From" value={name} />
									<tr>
										<td className="meta-label" style={styles.metaLabel}>
											Email
										</td>
										<td className="meta-value" style={styles.metaValue}>
											<Link href={`mailto:${email}`} style={styles.emailLink}>
												{email}
											</Link>
										</td>
									</tr>
									{reason && <MetaRow label="Reason" value={reason} />}
									{projectType && <MetaRow label="Project" value={projectType} />}
									{receivedAt && <MetaRow label="Received" value={receivedAt} />}
								</tbody>
							</table>
						</Section>
					</Section>

					<Section className="gutter" style={styles.messageWrap}>
						<Text style={styles.eyebrowDark}>Message</Text>
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
						<Link
							href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`}
							className="btn"
							style={styles.button}
						>
							{`Reply to ${firstName}`}
						</Link>
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
					{/* El pie explica POR QUÉ llegó este mail. Un footer que sólo
					    repite la marca no le sirve a nadie. */}
					<Text style={styles.footer}>
						You received this because someone submitted the contact form on{' '}
						<Link href={SITE_URL} style={{ color: C.muted, textDecoration: 'underline' }}>
							wagnerlabs.dev
						</Link>
						.
						<br />
						Posadas, Misiones, Argentina · Remote-first
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

/** Preview de React Email: se muestra con datos de ejemplo. */
ContactEmail.PreviewProps = {
	name: 'Lucía Fernández',
	email: 'lucia@estudioamber.com',
	reason: 'Freelance project',
	projectType: 'Backend',
	locale: 'es',
	receivedAt: '20 Aug 2026, 12:14 (GMT-3)',
	message:
		'Hola Nahue, te escribo desde Estudio Amber.\n\nEstamos armando una plataforma de reservas y necesitamos alguien que se haga cargo del backend: NestJS, Postgres y una integración con MercadoPago.\n\n¿Tenés disponibilidad para arrancar en septiembre?',
} satisfies ContactEmailProps;

export default ContactEmail;
