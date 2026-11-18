/**
 * Rate limiter en memoria, con ventana deslizante, por clave (la IP del cliente).
 *
 * Sin dependencias ni APIs de runtime: corre igual en Node y en Deno, así lo
 * comparten el middleware de dev y la función de servidor.
 *
 * LÍMITE CONOCIDO — LEER ANTES DE CONFIAR EN ESTO:
 * el estado vive en la memoria del proceso, así que sólo limita de verdad
 * cuando hay UN proceso vivo y largo (el middleware de dev, o un Node corriendo
 * en un server propio detrás de nginx).
 *
 * En serverless NO limita. Verificado con `netlify functions:serve`: 8 requests
 * seguidas pasaron las 8, porque cada invocación arranca con el Map vacío. Lo
 * mismo pasa en Lambda entre cold starts y con varias instancias detrás de un
 * balanceador: la cuenta se multiplica por la cantidad de instancias.
 *
 * Para que limite en serverless hace falta estado compartido (Netlify Blobs,
 * Redis/Upstash). En un server propio, lo ideal es nginx `limit_req`, que
 * además frena el request antes de que llegue a tocar Node.
 */

export const RATE_LIMIT = {
	/** Ventana deslizante. */
	windowMs: 60 * 60 * 1000, // 1 hora
	/** Envíos permitidos por clave dentro de la ventana. */
	max: 5,
	/**
	 * Tope de claves vigiladas a la vez. Sin esto el Map crece sin techo y un
	 * atacante rotando IPs convierte al propio limitador en la fuga de memoria
	 * que venía a evitar.
	 */
	maxTrackedKeys: 10_000,
} as const;

export interface RateLimitResult {
	allowed: boolean;
	/** Envíos que le quedan en la ventana actual. */
	remaining: number;
	/** Segundos hasta que se libere un cupo. 0 si todavía tiene. */
	retryAfterSeconds: number;
}

/** Marcas de tiempo de los envíos aceptados, por clave. */
const hits = new Map<string, number[]>();

/**
 * Descarta las marcas que ya salieron de la ventana y, si el Map creció
 * demasiado, tira las claves más viejas. Se llama en cada consulta: mantener
 * la limpieza acá evita depender de un timer, que en un edge runtime puede
 * no sobrevivir entre invocaciones.
 */
function prune(now: number): void {
	const cutoff = now - RATE_LIMIT.windowMs;
	for (const [key, times] of hits) {
		const fresh = times.filter((t) => t > cutoff);
		if (fresh.length === 0) hits.delete(key);
		else hits.set(key, fresh);
	}
	if (hits.size > RATE_LIMIT.maxTrackedKeys) {
		const excess = hits.size - RATE_LIMIT.maxTrackedKeys;
		let removed = 0;
		for (const key of hits.keys()) {
			hits.delete(key);
			if (++removed >= excess) break;
		}
	}
}

/**
 * Consulta y consume un cupo. Devuelve `allowed: false` cuando la clave ya
 * gastó su cuota; en ese caso NO se registra el intento, así un bot insistente
 * no se extiende solo el bloqueo para siempre.
 *
 * @param key   identificador del cliente (IP)
 * @param now   inyectable para poder testearlo sin esperar una hora
 */
export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
	prune(now);

	const cutoff = now - RATE_LIMIT.windowMs;
	const times = (hits.get(key) ?? []).filter((t) => t > cutoff);

	if (times.length >= RATE_LIMIT.max) {
		// El cupo se libera cuando el más viejo sale de la ventana.
		const oldest = times[0];
		const retryAfterSeconds = Math.max(1, Math.ceil((oldest + RATE_LIMIT.windowMs - now) / 1000));
		hits.set(key, times);
		return { allowed: false, remaining: 0, retryAfterSeconds };
	}

	times.push(now);
	hits.set(key, times);
	return {
		allowed: true,
		remaining: RATE_LIMIT.max - times.length,
		retryAfterSeconds: 0,
	};
}

/** Sólo para tests: vacía el estado entre casos. */
export function resetRateLimit(): void {
	hits.clear();
}

/**
 * Saca la IP real del cliente de las cabeceras de proxy.
 *
 * `x-forwarded-for` es una lista "cliente, proxy1, proxy2" y el cliente es el
 * PRIMERO. Ojo: cualquiera puede mandar esa cabecera, así que sólo es confiable
 * si tu proxy la reescribe (nginx: `proxy_set_header X-Forwarded-For $remote_addr`).
 * Si no, un bot cambia la cabecera en cada request y esquiva el límite.
 */
export function clientIpFromHeaders(
	get: (name: string) => string | null | undefined,
	fallback = 'unknown',
): string {
	const netlify = get('x-nf-client-connection-ip');
	if (netlify) return netlify.trim();

	const real = get('x-real-ip');
	if (real) return real.trim();

	const forwarded = get('x-forwarded-for');
	if (forwarded) {
		const first = forwarded.split(',')[0]?.trim();
		if (first) return first;
	}

	return fallback;
}
