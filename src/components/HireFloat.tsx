import { useEffect, useState } from 'react';
import { FiZap } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

function HireFloat() {
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 800);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const label = t('common.hireMe');

	return (
		<a
			href="#contact"
			aria-label={label}
			className={`md:hidden fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-accent shadow-xl shadow-primary/40 font-space text-sm font-medium transition-all duration-300 hover:bg-primary-pressed ${
				visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
			}`}
		>
			<FiZap className="w-4 h-4" />
			{label}
		</a>
	);
}

export default HireFloat;
