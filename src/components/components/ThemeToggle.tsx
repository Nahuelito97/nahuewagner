import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

type Theme = 'dark' | 'light';

function getInitial(): Theme {
	try {
		return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
	} catch {
		return 'dark';
	}
}

/** Alterna entre tema oscuro (Orix) y claro. Persiste en localStorage. */
function ThemeToggle({ className = '' }: { className?: string }) {
	const { t } = useTranslation();
	const [theme, setTheme] = useState<Theme>(getInitial);

	useEffect(() => {
		document.documentElement.classList.toggle('light', theme === 'light');
		try {
			localStorage.setItem('theme', theme);
		} catch {
			/* ignore */
		}
	}, [theme]);

	const label = t('themeToggleLabel', { defaultValue: 'Cambiar tema' });

	return (
		<button
			type="button"
			onClick={() => setTheme((p) => (p === 'light' ? 'dark' : 'light'))}
			aria-label={label}
			title={label}
			className={`inline-flex items-center justify-center p-1.5 rounded-md border border-outline text-content-muted hover:text-primary hover:border-primary/50 transition-colors ${className}`}
		>
			{theme === 'light' ? (
				<FiMoon className="w-3.5 h-3.5" aria-hidden="true" />
			) : (
				<FiSun className="w-3.5 h-3.5" aria-hidden="true" />
			)}
		</button>
	);
}

export default ThemeToggle;
