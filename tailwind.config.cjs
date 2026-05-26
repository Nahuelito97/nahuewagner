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
				// — superficies (índigo, dark) —
				bg: '#312C51',
				surface: {
					DEFAULT: '#48426D',
					variant: '#565081',
				},
				outline: '#574F86',
				// — texto —
				content: {
					DEFAULT: '#F5F3FB', // text
					muted: '#B9B3D6',
				},
				// — acentos —
				primary: {
					DEFAULT: '#F0C38E', // peach
					pressed: '#E3A86E',
				},
				secondary: '#F1AA9B', // coral
				'on-accent': '#2A2547',
				// — estados (rol semántico) —
				success: '#34D399', // emerald
				danger: '#F87171',
				warn: '#FBBF24', // amber
				syncing: '#56C6F5', // cyan
				inactive: '#9D97C0', // zinc
				// — neutrales modo claro (solo si se necesita light) —
				light: {
					bg: '#F3EFE9',
					surface: '#FFFFFF',
					'surface-variant': '#EDE7F2',
					outline: '#DDD6E8',
					content: '#2A2547',
					muted: '#6B6577',
				},
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
