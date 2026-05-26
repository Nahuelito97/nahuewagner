export interface Testimonial {
	quote: string;
	name: string;
	role: string;
	company?: string;
}

// ⚠️ PLACEHOLDERS — replace with real LinkedIn recommendations before going live.
// Tip: keep quotes to 2-3 sentences and concrete (impact, what was shipped).
const testimonials: Testimonial[] = [
	{
		quote:
			'Replace this with a real recommendation — e.g. how Nahuel led the team, the impact he had, and what he delivered.',
		name: 'Manager / Tech Lead',
		role: 'Their role',
		company: 'Company',
	},
	{
		quote:
			'A second testimonial goes here. Pull the best lines from your LinkedIn recommendations.',
		name: 'Colleague',
		role: 'Their role',
		company: 'Company',
	},
	{
		quote: 'A client testimonial works great here — focus on outcomes and reliability.',
		name: 'Client',
		role: 'Their role',
		company: 'Company',
	},
];

export default testimonials;
