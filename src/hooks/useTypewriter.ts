import { useEffect, useState } from 'react';

interface TypewriterOpts {
	typeSpeed?: number;
	deleteSpeed?: number;
	pauseAfter?: number;
	startDelay?: number;
	enabled?: boolean;
}

/**
 * Types each word, pauses, deletes it, and moves to the next one (looping).
 * Pass `enabled: false` to keep the value static (e.g. on prefers-reduced-motion).
 */
export function useTypewriter(words: string[], opts: TypewriterOpts = {}): string {
	const {
		typeSpeed = 70,
		deleteSpeed = 40,
		pauseAfter = 1500,
		startDelay = 400,
		enabled = true,
	} = opts;
	const [text, setText] = useState('');
	const [idx, setIdx] = useState(0);
	const [deleting, setDeleting] = useState(false);
	const [started, setStarted] = useState(false);

	useEffect(() => {
		if (!enabled) return;
		if (!started) {
			const t = setTimeout(() => setStarted(true), startDelay);
			return () => clearTimeout(t);
		}
		const current = words[idx] ?? '';
		if (!deleting && text === current) {
			const t = setTimeout(() => setDeleting(true), pauseAfter);
			return () => clearTimeout(t);
		}
		if (deleting && text === '') {
			// Igual que el resto del hook, la transición a la próxima palabra pasa
			// por el timer y no por un setState sincrónico: así no dispara un
			// render en cascada y además queda una pausa natural entre palabras.
			const t = setTimeout(() => {
				setDeleting(false);
				setIdx((i) => (i + 1) % words.length);
			}, deleteSpeed);
			return () => clearTimeout(t);
		}
		const next = deleting
			? current.slice(0, text.length - 1)
			: current.slice(0, text.length + 1);
		const t = setTimeout(() => setText(next), deleting ? deleteSpeed : typeSpeed);
		return () => clearTimeout(t);
	}, [enabled, started, text, deleting, idx, words, typeSpeed, deleteSpeed, pauseAfter, startDelay]);

	return text;
}
