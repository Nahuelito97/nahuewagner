import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import Logo from './Logo';

afterEach(cleanup);

describe('Logo', () => {
	it('renders the brand mark and name', () => {
		const { container } = render(<Logo />);
		expect(container.textContent).toContain('wagnerlabs.dev');
		expect(screen.getByText('NW')).toBeTruthy();
	});
});
