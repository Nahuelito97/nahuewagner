import type { IconType } from 'react-icons';
import { ICONS } from '../content/icons.generated';

// Resuelve un ícono react-icons desde {lib, name} usando el módulo
// autogenerado (solo contiene los íconos que el CMS realmente usa).
const Fallback: IconType = () => null;

export function icon(lib: string, name: string): IconType {
	return ICONS[`${lib}:${name}`] ?? Fallback;
}
