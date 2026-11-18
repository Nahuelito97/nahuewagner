/** Asunto del mail. Vive aparte porque lo necesitan tanto el componente (para
 *  el mailto del botón Reply) como el renderer que se lo pasa a Resend. */
export function buildSubject(name: string, reason: string): string {
	return reason ? `Portfolio contact — ${reason} — ${name}` : `Portfolio contact — ${name}`;
}
