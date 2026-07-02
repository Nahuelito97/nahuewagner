import { createElement, type ReactNode } from 'react';
import generated from '../content/techIcons.json';
import { icon } from '../lib/icon';

// Administrado por el CMS. Mantiene la misma forma { icon, color } que usan
// los componentes; el ícono se resuelve desde react-icons vía {lib, name}.
interface TechIconData {
	key: string;
	iconLib: string;
	iconName: string;
	color: string;
}

export const techIcons: Record<string, { icon: ReactNode; color: string }> =
	Object.fromEntries(
		(generated as TechIconData[]).map((t) => [
			t.key,
			{ icon: createElement(icon(t.iconLib, t.iconName)), color: t.color },
		]),
	);
