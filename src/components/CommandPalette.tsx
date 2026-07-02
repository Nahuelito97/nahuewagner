import { lazy, Suspense, useEffect, useState } from 'react';

// El diálogo (headlessui Combobox + Dialog) se carga recién al abrir la paleta,
// así no pesa en el bundle inicial.
const CommandPaletteDialog = lazy(() => import('./components/CommandPaletteDialog'));

function CommandPalette() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};
		const onOpen = () => setOpen(true);
		window.addEventListener('keydown', onKey);
		window.addEventListener('command-palette:open', onOpen);
		return () => {
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('command-palette:open', onOpen);
		};
	}, []);

	if (!open) return null;

	return (
		<Suspense fallback={null}>
			<CommandPaletteDialog onClose={() => setOpen(false)} />
		</Suspense>
	);
}

export default CommandPalette;
