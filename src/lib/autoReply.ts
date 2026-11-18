/**
 * Interruptor del acuse automático que recibe quien completa el formulario.
 *
 * ARRANCA APAGADO, Y ES A PROPÓSITO.
 *
 * El acuse manda un mail a una dirección que escribe un DESCONOCIDO en el
 * formulario. Sin un rate limit efectivo, cualquiera puede pedir mil acuses
 * apuntando a una misma víctima y usar este dominio para bombardearla. El
 * costo no lo paga la víctima: lo paga el dominio, que termina denunciado
 * como spam, con la reputación quemada y la cuenta de Resend suspendida.
 *
 * El limitador que debería frenarlo (src/lib/rateLimit.ts) guarda el estado
 * en la memoria del proceso, así que en serverless NO limita: cada invocación
 * arranca con el Map vacío. Está verificado con `netlify functions:serve`.
 *
 * Por eso el acuse se enciende EXPLÍCITAMENTE, y sólo corresponde encenderlo
 * donde el límite sea real:
 *   - un proceso Node vivo y largo detrás de nginx (server propio), o
 *   - cuando el limitador use estado compartido (Netlify Blobs, Redis).
 *
 * La notificación interna NO pasa por acá: esa va a una casilla fija que
 * define el servidor, no el visitante, así que no es un vector de abuso.
 *
 * Encenderlo:  CONTACT_AUTO_REPLY=true
 *
 * Sin dependencias ni APIs de runtime: el valor entra por parámetro para que
 * este módulo siga corriendo igual en Node, Deno y el browser.
 */
export function autoReplyEnabled(value: string | null | undefined): boolean {
	const raw = value?.trim().toLowerCase();
	// Allowlist explícita: cualquier otra cosa (incluido "yes", "sí" o basura)
	// deja el acuse apagado. Ante la duda, no mandar.
	return raw === 'true' || raw === '1' || raw === 'on';
}
