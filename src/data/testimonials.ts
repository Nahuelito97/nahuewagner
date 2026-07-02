import generated from '../content/testimonials.json';

// Administrado por el CMS. El componente lee estos campos directo (no i18n);
// se expone la variante ES de cada testimonio.
export interface Testimonial {
	quote: string;
	name: string;
	role: string;
	company?: string;
}

interface TestimonialData {
	company?: string | null;
	translations: { es: { quote: string; name: string; role: string } };
}

const testimonials: Testimonial[] = (generated as TestimonialData[]).map((t) => ({
	quote: t.translations.es.quote,
	name: t.translations.es.name,
	role: t.translations.es.role,
	company: t.company ?? undefined,
}));

export default testimonials;
