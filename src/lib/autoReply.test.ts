import { describe, it, expect } from 'vitest';
import { autoReplyEnabled } from './autoReply';

describe('autoReplyEnabled — fails closed', () => {
	// El default importa más que los casos positivos: si esto se enciende solo,
	// el sitio empieza a mandar mails a direcciones que elige un desconocido.
	it('is off when the variable is not set at all', () => {
		expect(autoReplyEnabled(undefined)).toBe(false);
		expect(autoReplyEnabled(null)).toBe(false);
	});

	it('is off for an empty or blank value', () => {
		// Un `.env` con `CONTACT_AUTO_REPLY=` inyecta un string vacío, que no es
		// nullish: el mismo tropiezo que ya costó un 422 con RESEND_TO.
		expect(autoReplyEnabled('')).toBe(false);
		expect(autoReplyEnabled('   ')).toBe(false);
	});

	it.each(['false', '0', 'off', 'no', 'yes', 'sí', 'enabled', 'TRUE_ISH', 'true false'])(
		'is off for %s',
		(value) => {
			expect(autoReplyEnabled(value)).toBe(false);
		},
	);
});

describe('autoReplyEnabled — explicit opt-in', () => {
	it.each(['true', '1', 'on'])('is on for %s', (value) => {
		expect(autoReplyEnabled(value)).toBe(true);
	});

	it.each(['TRUE', 'True', 'ON', 'On'])('is case insensitive for %s', (value) => {
		expect(autoReplyEnabled(value)).toBe(true);
	});

	it('tolerates surrounding whitespace', () => {
		expect(autoReplyEnabled('  true  ')).toBe(true);
	});
});
