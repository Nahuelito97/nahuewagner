import { FiGlobe } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

/** Two-state language toggle button. Shows the *current* language; click cycles to the other. */
function LangToggle({ className = '' }: { className?: string }) {
	const { i18n, t } = useTranslation();
	const current = i18n.resolvedLanguage === 'es' ? 'es' : 'en';
	const next = current === 'es' ? 'en' : 'es';

	return (
		<button
			type="button"
			onClick={() => i18n.changeLanguage(next)}
			aria-label={t('langToggleLabel')}
			title={t('langToggleLabel')}
			className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-outline text-content-muted hover:text-primary hover:border-primary/50 transition-colors text-xs font-mono ${className}`}
		>
			<FiGlobe className="w-3.5 h-3.5" aria-hidden="true" />
			{current.toUpperCase()}
		</button>
	);
}

export default LangToggle;
