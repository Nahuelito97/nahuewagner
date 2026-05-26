import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const ScrollButton = () => {
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 400);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<button
			type="button"
			onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			aria-label={t('common.scrollToTop')}
			className={`fixed bottom-20 md:bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-on-accent shadow-lg shadow-primary/30 transition-all duration-300 hover:bg-primary-pressed hover:scale-110 focus-visible:scale-110 ${
				visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
			}`}
		>
			<FiArrowUp className="w-5 h-5" />
		</button>
	);
};

export default ScrollButton;
