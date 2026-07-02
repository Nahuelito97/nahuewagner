import { useEffect } from 'react';

// Acceso oculto al panel admin (sin botón visible). Disparadores:
//  • Atajo de teclado: Ctrl/Cmd + Shift + A
//  • URL secreta: #admin
// La seguridad real la pone Firebase (login con Google + allowlist de email);
// esto solo es una entrada discreta que no aparece para el visitante común.
const ADMIN_URL =
	(import.meta.env.VITE_ADMIN_URL as string | undefined) ?? 'http://localhost:5174';

function go(): void {
	window.location.href = ADMIN_URL;
}

function AdminAccess(): null {
	useEffect(() => {
		if (window.location.hash.toLowerCase() === '#admin') {
			go();
			return;
		}
		const onKey = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
				e.preventDefault();
				go();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	return null;
}

export default AdminAccess;
