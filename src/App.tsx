import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconContext } from 'react-icons';
import { useTranslation } from 'react-i18next';
import {
	About,
	Clients,
	Commitments,
	Contact,
	FAQ,
	Footer,
	FreeAudit,
	Intro,
	Portfolio,
	Process,
	Services,
	Timeline,
	Navbar,
	TechStack,
} from './components';
import ScrollButton from './components/ScrollButton';
import CommandPalette from './components/CommandPalette';
import MobileNav from './components/MobileNav';
import HireFloat from './components/HireFloat';

function App() {
	const { t, i18n } = useTranslation();

	// Keep <html lang> in sync with the active language for a11y + SEO.
	useEffect(() => {
		const apply = () => {
			document.documentElement.lang = i18n.resolvedLanguage ?? 'en';
		};
		apply();
		i18n.on('languageChanged', apply);
		return () => i18n.off('languageChanged', apply);
	}, [i18n]);

	return (
		<IconContext.Provider value={{ attr: { 'aria-hidden': true } }}>
		<div className="min-h-screen pb-16 md:pb-0">
			{/* Decorative backdrop — fades in on first load */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1.4, ease: 'easeOut' }}
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
			>
				<div className="absolute inset-0 bg-grid opacity-60" />
				<div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/10 blur-[120px]" />
				<div className="absolute top-1/3 left-[-15%] h-[420px] w-[420px] rounded-full bg-secondary/10 blur-[130px]" />
			</motion.div>

			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-on-accent focus:font-space"
			>
				{t('skipToContent')}
			</a>

			<Navbar />

			<main id="main" className="max-w-5xl w-11/12 mx-auto">
				<Intro />
				<Clients />
				<About />
				<Services />
				<Process />
				<Portfolio />
				<Timeline />
				<TechStack />
				<FAQ />
				<FreeAudit />
				<Commitments />
				<Contact />
			</main>

			<Footer />
			<ScrollButton />
			<CommandPalette />
			<MobileNav />
			<HireFloat />
		</div>
		</IconContext.Provider>
	);
}

export default App;
