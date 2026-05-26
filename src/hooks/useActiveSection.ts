import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view (scrollspy).
 * Pass a stable array of element ids; returns the id of the active one.
 */
export function useActiveSection(ids: string[]): string {
	const [active, setActive] = useState('');

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActive(entry.target.id);
				}
			},
			// Activate when a section sits roughly in the middle of the viewport.
			{ rootMargin: '-40% 0px -55% 0px', threshold: 0 },
		);

		const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
		els.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, [ids]);

	return active;
}
