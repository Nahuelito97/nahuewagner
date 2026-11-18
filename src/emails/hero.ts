/**
 * Configuración y estilos del bloque hero que comparten los dos mails.
 *
 * El hero es una banda oscura con el titular en mayúsculas y serif, inspirada
 * en los mails de bienvenida donde el texto va sobre una foto a sangre.
 *
 * SOBRE LA FOTO — leer antes de poner una:
 * la mayoría de los clientes de correo bloquean las imágenes hasta que el
 * usuario las habilita. Si el titular vive ENCIMA de la imagen y ésta no carga,
 * el titular desaparece. Por eso el hero se arma con la técnica de fondo a
 * prueba de balas: la celda lleva `bgcolor` sólido con el violeta de marca Y la
 * imagen como atributo `background`. Si la foto carga, se ve; si no, queda el
 * color y el texto blanco sigue perfectamente legible.
 *
 * Para activar la foto, poner acá una URL ABSOLUTA y pública (las relativas no
 * existen en un cliente de correo). Vacío = sólo color, que es el default.
 */
export const HERO_IMAGE_URL = '';

/** Serif: Georgia está instalada en Windows, macOS, iOS y Android, que es lo
 *  más cerca de "universal" que se consigue en correo. */
export const SERIF =
	"Georgia, 'Times New Roman', Times, serif";

export const HERO_COLORS = {
	/** Fondo del hero. También es el fallback si la foto no carga. */
	bg: '#2A2547',
	/** Titular y cuerpo sobre el hero. */
	fg: '#FFFFFF',
	/** Eyebrow: el único uso del acento fuera del botón, y a 10px. */
	accent: '#F0C38E',
	/** Cuerpo dentro del hero, apenas apagado para que el titular mande. */
	body: '#CFC9DE',
} as const;
