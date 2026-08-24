import { describe, it, expect, beforeEach } from 'vitest';
import { RATE_LIMIT, checkRateLimit, clientIpFromHeaders, resetRateLimit } from './rateLimit';

/** Instante fijo: el limitador recibe `now` por parámetro justamente para
 *  poder correr una hora de ventana sin esperarla. */
const T0 = 1_700_000_000_000;

beforeEach(() => {
	resetRateLimit();
});

/** Gasta `times` envíos de una clave en el mismo instante. */
const burn = (key: string, times: number, now = T0) => {
	for (let i = 0; i < times; i++) checkRateLimit(key, now);
};

describe('checkRateLimit — quota', () => {
	it('allows exactly max requests inside the window', () => {
		for (let i = 0; i < RATE_LIMIT.max; i++) {
			expect(checkRateLimit('ip', T0).allowed, `request ${i + 1}`).toBe(true);
		}
	});

	it('blocks the next request once the quota is spent', () => {
		burn('ip', RATE_LIMIT.max);
		const result = checkRateLimit('ip', T0);
		expect(result.allowed).toBe(false);
		expect(result.remaining).toBe(0);
		expect(result.retryAfterSeconds).toBeGreaterThan(0);
	});

	it('counts remaining down to zero', () => {
		const seen: number[] = [];
		for (let i = 0; i < RATE_LIMIT.max; i++) seen.push(checkRateLimit('ip', T0).remaining);
		expect(seen).toEqual([4, 3, 2, 1, 0]);
	});

	it('keeps each key independent', () => {
		burn('attacker', RATE_LIMIT.max);
		expect(checkRateLimit('attacker', T0).allowed).toBe(false);
		// Un visitante distinto no paga el bloqueo del anterior.
		expect(checkRateLimit('someone-else', T0).allowed).toBe(true);
	});
});

describe('checkRateLimit — a blocked client cannot extend its own block', () => {
	// Propiedad de diseño: los intentos RECHAZADOS no se registran. Si se
	// registraran, un bot insistiendo se auto-renovaría el bloqueo para
	// siempre y nunca podría volver a entrar.
	it('shrinks retryAfter as time passes instead of growing it', () => {
		burn('bot', RATE_LIMIT.max);

		const early = checkRateLimit('bot', T0 + 1_000);
		const later = checkRateLimit('bot', T0 + 60_000);

		expect(early.allowed).toBe(false);
		expect(later.allowed).toBe(false);
		expect(later.retryAfterSeconds).toBeLessThan(early.retryAfterSeconds);
	});

	it('still lets the client back in on schedule after hammering the endpoint', () => {
		burn('bot', RATE_LIMIT.max);
		// 50 intentos rechazados en el medio no deberían mover la fecha de salida.
		for (let i = 0; i < 50; i++) checkRateLimit('bot', T0 + i * 1_000);

		expect(checkRateLimit('bot', T0 + RATE_LIMIT.windowMs + 1).allowed).toBe(true);
	});
});

describe('checkRateLimit — sliding window', () => {
	it('lets the client through again once the whole window has passed', () => {
		burn('ip', RATE_LIMIT.max);
		expect(checkRateLimit('ip', T0 + 1_000).allowed).toBe(false);
		expect(checkRateLimit('ip', T0 + RATE_LIMIT.windowMs + 1).allowed).toBe(true);
	});

	it('frees exactly one slot when the oldest hit leaves the window', () => {
		checkRateLimit('ip', T0);
		burn('ip', RATE_LIMIT.max - 1, T0 + 1_000);
		expect(checkRateLimit('ip', T0 + 2_000).allowed).toBe(false);

		// Justo después de que el más viejo sale: se libera UN cupo, no la cuota
		// entera. Eso es lo que la hace deslizante y no un reinicio por tramos.
		const justAfter = T0 + RATE_LIMIT.windowMs + 1;
		const first = checkRateLimit('ip', justAfter);
		expect(first.allowed).toBe(true);
		expect(first.remaining).toBe(0);
		expect(checkRateLimit('ip', justAfter).allowed).toBe(false);
	});

	it('never reports a retryAfter below one second', () => {
		burn('ip', RATE_LIMIT.max);
		// Un milisegundo antes de liberarse: redondear a 0 haría que el cliente
		// reintente al instante y se coma otro rechazo.
		const result = checkRateLimit('ip', T0 + RATE_LIMIT.windowMs - 1);
		expect(result.retryAfterSeconds).toBeGreaterThanOrEqual(1);
	});
});

describe('clientIpFromHeaders', () => {
	const from = (headers: Record<string, string>) => (name: string) => headers[name];

	it('prefers the Netlify connection IP over anything the client can forge', () => {
		const ip = clientIpFromHeaders(
			from({
				'x-nf-client-connection-ip': '203.0.113.7',
				'x-real-ip': '198.51.100.1',
				'x-forwarded-for': '192.0.2.1',
			}),
		);
		expect(ip).toBe('203.0.113.7');
	});

	it('falls back to x-real-ip when Netlify did not set its header', () => {
		expect(clientIpFromHeaders(from({ 'x-real-ip': '198.51.100.1' }))).toBe('198.51.100.1');
	});

	it('takes the FIRST entry of x-forwarded-for, which is the client', () => {
		// La lista es "cliente, proxy1, proxy2": agarrar el último devolvería
		// la IP del proxy y todos compartirían la misma cuota.
		const ip = clientIpFromHeaders(from({ 'x-forwarded-for': '192.0.2.1, 70.41.3.18, 150.172.238.178' }));
		expect(ip).toBe('192.0.2.1');
	});

	it('trims surrounding whitespace', () => {
		expect(clientIpFromHeaders(from({ 'x-real-ip': '  198.51.100.1  ' }))).toBe('198.51.100.1');
	});

	it('returns the fallback when no header carries an IP', () => {
		expect(clientIpFromHeaders(() => undefined)).toBe('unknown');
		expect(clientIpFromHeaders(() => null, 'anon')).toBe('anon');
	});

	it('skips empty headers instead of returning an empty IP', () => {
		const ip = clientIpFromHeaders(
			from({ 'x-nf-client-connection-ip': '', 'x-real-ip': '198.51.100.1' }),
		);
		expect(ip).toBe('198.51.100.1');
	});
});
