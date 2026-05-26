import type { IconType } from 'react-icons';
import { FiZap, FiSearch, FiUsers } from 'react-icons/fi';

export interface Service {
	/** Key used to look up title/summary/bullets/cta in the i18n bundle. */
	id: 'mvp' | 'audit' | 'lead';
	icon: IconType;
	/** Indicative price chip — keep short, e.g. "From USD $3,500". Same in both languages. */
	price?: string;
}

const services: Service[] = [
	{ id: 'mvp', icon: FiZap, price: 'From USD $3,500' },
	{ id: 'audit', icon: FiSearch, price: 'From USD $400' },
	{ id: 'lead', icon: FiUsers, price: 'From USD $80 / hr' },
];

export default services;
