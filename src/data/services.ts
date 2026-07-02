import type { IconType } from 'react-icons';
import generated from '../content/services.json';
import { icon } from '../lib/icon';

// Administrado por el CMS. Texto (title/summary/bullets/cta) vía i18n
// services.list.<id>.*; ícono resuelto desde {lib, name}.
export interface Service {
	id: string;
	icon: IconType;
	price?: string;
}

interface ServiceData {
	id: string;
	iconLib: string;
	iconName: string;
	price?: string | null;
}

const services: Service[] = (generated as ServiceData[]).map((s) => ({
	id: s.id,
	icon: icon(s.iconLib, s.iconName),
	price: s.price ?? undefined,
}));

export default services;
