import { describe, it, expect } from 'vitest';
import { LIMITS, PROJECT_TYPES, REASONS, isBot, validateContact } from './contactValidation';

/** Payload mínimo válido. Cada caso parte de acá y rompe UNA sola cosa. */
const valid = () => ({
	name: 'Nahuel Wagner',
	email: 'nahuel@example.com',
	message: 'Hola, quiero consultarte por un proyecto backend.',
	reason: 'Freelance project',
	projectType: 'Backend',
	locale: 'es',
});

const ok = (raw: unknown) => {
	const r = validateContact(raw);
	if (!r.ok) throw new Error(`expected valid, got "${r.error}"`);
	return r.data;
};

const rejected = (raw: unknown) => {
	const r = validateContact(raw);
	if (r.ok) throw new Error('expected rejection, got ok');
	return r;
};

describe('validateContact — header injection', () => {
	// Estos campos viajan al asunto y a cabeceras del mail. Un salto de línea
	// ahí permite inyectar cabeceras nuevas (Bcc, Reply-To). Es LA razón por la
	// que existe el stripping de caracteres de control.
	it('strips CR and LF from the name so no header can be injected', () => {
		const data = ok({ ...valid(), name: 'Nahuel\r\nBcc: victim@evil.com' });
		expect(data.name).not.toMatch(/[\r\n]/);
	});

	it('rejects an email carrying an injected header', () => {
		// Al sacarle el salto queda "a@b.comBcc: x@evil.com": el espacio interno
		// hace que ya no pase el regex, así que cae por doble motivo.
		expect(rejected({ ...valid(), email: 'a@b.com\nBcc: x@evil.com' }).field).toBe('email');
	});

	it('strips NUL and other control characters from single-line fields', () => {
		const data = ok({ ...valid(), name: 'Na\u0000hu\u0007el' });
		expect(data.name).toBe('Nahuel');
	});

	it('strips control characters hidden in the message body', () => {
		const data = ok({ ...valid(), message: 'Un mensaje \u0000con basura\u0007 adentro.' });
		expect(data.message).toBe('Un mensaje con basura adentro.');
	});
});

describe('validateContact — message body', () => {
	// Regresión: una versión previa usaba el rango de control completo, que
	// incluye U+000A, y borraba todos los párrafos del mensaje.
	it('keeps paragraph breaks', () => {
		const data = ok({ ...valid(), message: 'Primer párrafo.\n\nSegundo párrafo.' });
		expect(data.message).toBe('Primer párrafo.\n\nSegundo párrafo.');
	});

	it('normalises CRLF to LF', () => {
		const data = ok({ ...valid(), message: 'Una línea.\r\nOtra línea.' });
		expect(data.message).toBe('Una línea.\nOtra línea.');
	});

	it('collapses runs of blank lines so nobody can stretch the email', () => {
		const data = ok({ ...valid(), message: 'Arriba.\n\n\n\n\n\nAbajo.' });
		expect(data.message).toBe('Arriba.\n\nAbajo.');
	});
});

describe('validateContact — length limits', () => {
	it('rejects a name below the minimum', () => {
		expect(rejected({ ...valid(), name: 'N' }).field).toBe('name');
	});

	it('rejects a name above the maximum', () => {
		expect(rejected({ ...valid(), name: 'a'.repeat(LIMITS.name.max + 1) }).field).toBe('name');
	});

	it('accepts a name exactly at the boundaries', () => {
		expect(ok({ ...valid(), name: 'a'.repeat(LIMITS.name.min) }).name).toHaveLength(LIMITS.name.min);
		expect(ok({ ...valid(), name: 'a'.repeat(LIMITS.name.max) }).name).toHaveLength(LIMITS.name.max);
	});

	it('rejects a message below the minimum', () => {
		expect(rejected({ ...valid(), message: 'corto' }).field).toBe('message');
	});

	it('rejects a message above the maximum', () => {
		expect(rejected({ ...valid(), message: 'a'.repeat(LIMITS.message.max + 1) }).field).toBe(
			'message',
		);
	});

	it('rejects an email longer than RFC 5321 allows', () => {
		const long = 'a'.repeat(LIMITS.email.max) + '@example.com';
		expect(rejected({ ...valid(), email: long }).field).toBe('email');
	});
});

describe('validateContact — email shape', () => {
	it.each(['nahuel@example.com', 'a.b+tag@sub.example.co.uk'])('accepts %s', (email) => {
		expect(ok({ ...valid(), email }).email).toBe(email);
	});

	// 'a@b.c' es el caso que motivó endurecer el regex: un TLD de un solo
	// carácter no existe, así que era basura entrando como válida.
	it.each([
		'a@b.c',
		'sin-arroba.com',
		'@example.com',
		'dos@@example.com',
		'con espacio@example.com',
	])('rejects %s', (email) => {
		expect(rejected({ ...valid(), email }).field).toBe('email');
	});
});

describe('validateContact — select allowlists', () => {
	it.each(REASONS)('accepts the known reason %s', (reason) => {
		expect(ok({ ...valid(), reason }).reason).toBe(reason);
	});

	it.each(PROJECT_TYPES)('accepts the known project type %s', (projectType) => {
		expect(ok({ ...valid(), projectType }).projectType).toBe(projectType);
	});

	it('rejects a reason outside the allowlist', () => {
		expect(rejected({ ...valid(), reason: 'Something I made up' }).field).toBe('reason');
	});

	it('rejects a project type outside the allowlist', () => {
		expect(rejected({ ...valid(), projectType: '<script>alert(1)</script>' }).field).toBe(
			'projectType',
		);
	});

	it('treats both selects as optional', () => {
		const data = ok({ ...valid(), reason: '', projectType: '' });
		expect(data.reason).toBe('');
		expect(data.projectType).toBe('');
	});
});

describe('validateContact — locale', () => {
	// El locale nunca invalida el contacto: perder un cliente real por un
	// locale raro sería absurdo. Se normaliza y punto.
	it('narrows a regional locale to its base language', () => {
		expect(ok({ ...valid(), locale: 'es-AR' }).locale).toBe('es');
	});

	it('is case insensitive', () => {
		expect(ok({ ...valid(), locale: 'ES' }).locale).toBe('es');
	});

	it.each([['fr'], ['klingon'], [''], [undefined], [42]])(
		'falls back to en for %s instead of failing',
		(locale) => {
			expect(ok({ ...valid(), locale }).locale).toBe('en');
		},
	);
});

describe('validateContact — malformed payloads', () => {
	it.each([[null], [undefined], ['a string'], [42], [true]])('rejects %s outright', (raw) => {
		expect(rejected(raw).error).toBe('Invalid payload');
	});

	it('rejects an empty object without throwing', () => {
		expect(rejected({}).field).toBe('name');
	});

	it('treats non-string field values as empty rather than crashing', () => {
		expect(rejected({ ...valid(), name: { evil: true } }).field).toBe('name');
		expect(rejected({ ...valid(), message: ['a', 'b'] }).field).toBe('message');
	});
});

describe('isBot — honeypot', () => {
	it('flags a filled honeypot', () => {
		expect(isBot({ company: 'Acme Inc' })).toBe(true);
	});

	it.each([[''], ['   '], [undefined], [null]])(
		'lets a human through with company=%s',
		(company) => {
			expect(isBot({ company })).toBe(false);
		},
	);

	it('lets a human through when the field is absent', () => {
		expect(isBot({})).toBe(false);
	});
});
