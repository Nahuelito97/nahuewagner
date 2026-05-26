import { describe, it, expect } from 'vitest';
import portfolio from './portfolio';
import en from '../locales/en.json';

describe('portfolio data', () => {
	it('lists at least three projects', () => {
		expect(portfolio.length).toBeGreaterThanOrEqual(3);
	});

	it('every project has the required fields', () => {
		for (const p of portfolio) {
			expect(p.id.length).toBeGreaterThan(0);
			expect(p.category.length).toBeGreaterThan(0);
			expect(p.stack.length).toBeGreaterThan(0);
		}
	});

	it('has unique project ids', () => {
		const ids = portfolio.map((p) => p.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every project has translations in the EN bundle', () => {
		for (const p of portfolio) {
			const entry = (en.portfolio.projects as Record<string, unknown>)[p.id] as
				| { title?: string; highlights?: string[] }
				| undefined;
			expect(entry, `missing portfolio.projects.${p.id}`).toBeDefined();
			expect(entry?.title?.length ?? 0, `empty title for ${p.id}`).toBeGreaterThan(0);
			expect((entry?.highlights ?? []).length, `empty highlights for ${p.id}`).toBeGreaterThan(0);
		}
	});
});
