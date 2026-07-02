/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
	darkMode: 'class', // Orix es dark-first
	theme: {
		extend: {
			fontFamily: {
				// Geist (Vercel's font) used everywhere; the legacy names stay so the existing
				// className references (font-inter / font-space / font-mono) keep working.
				inter: ['Geist', 'sans-serif'],
				space: ['Geist', 'sans-serif'],
				mono: ['"Geist Mono"', 'monospace'],
			},
			colors: {
				// Paleta Orix vía CSS variables (ver src/styles/tailwind.css).
				// Dark = valores originales; light = override con la clase .light.
				bg: 'rgb(var(--c-bg) / <alpha-value>)',
				surface: {
					DEFAULT: 'rgb(var(--c-surface) / <alpha-value>)',
					variant: 'rgb(var(--c-surface-variant) / <alpha-value>)',
				},
				outline: 'rgb(var(--c-outline) / <alpha-value>)',
				content: {
					DEFAULT: 'rgb(var(--c-content) / <alpha-value>)',
					muted: 'rgb(var(--c-content-muted) / <alpha-value>)',
				},
				primary: {
					DEFAULT: 'rgb(var(--c-primary) / <alpha-value>)',
					pressed: 'rgb(var(--c-primary-pressed) / <alpha-value>)',
				},
				secondary: 'rgb(var(--c-secondary) / <alpha-value>)',
				'on-accent': 'rgb(var(--c-on-accent) / <alpha-value>)',
				success: 'rgb(var(--c-success) / <alpha-value>)',
				danger: 'rgb(var(--c-danger) / <alpha-value>)',
				warn: 'rgb(var(--c-warn) / <alpha-value>)',
				syncing: 'rgb(var(--c-syncing) / <alpha-value>)',
				inactive: 'rgb(var(--c-inactive) / <alpha-value>)',
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fadeIn 0.5s ease-in-out',
				marquee: 'marquee 40s linear infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				marquee: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' },
				},
			},
		},
	},
	plugins: [],
};
