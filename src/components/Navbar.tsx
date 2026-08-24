import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FiSearch } from 'react-icons/fi';
import { Logo, Sections } from './components';
import LangToggle from './components/LangToggle';
import ThemeToggle from './components/ThemeToggle';
import { useActiveSection } from '../hooks/useActiveSection';

const SECTION_IDS = ['about', 'services', 'work', 'experience', 'skills', 'contact'];

const openPalette = () => window.dispatchEvent(new Event('command-palette:open'));

const Navbar = () => {
	const { t } = useTranslation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const active = useActiveSection(SECTION_IDS);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
				scrolled
					? 'bg-bg/80 backdrop-blur-md border-b border-outline/50 shadow-xs shadow-black/20'
					: 'bg-transparent'
			}`}
		>
			<nav className="max-w-5xl w-11/12 mx-auto flex items-center justify-between h-16">
				<Logo />

				{/* Desktop nav */}
				<div className="hidden lg:flex items-center gap-2">
					<Sections active={active} />
					<ThemeToggle className="ml-2" />
					<LangToggle />
					<button
						type="button"
						onClick={openPalette}
						aria-label={t('palette.openLabel')}
						className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-outline text-content-muted hover:text-primary hover:border-primary/50 transition-colors"
					>
						<FiSearch className="w-3.5 h-3.5" />
						<kbd aria-hidden="true" className="text-[10px] font-mono">
							⌘K
						</kbd>
					</button>
				</div>

				{/* Mobile actions */}
				<div className="lg:hidden flex items-center gap-1">
					<ThemeToggle />
					<LangToggle />
					<button
						type="button"
						onClick={openPalette}
						aria-label={t('palette.openLabel')}
						className="p-2 rounded-md text-content-muted hover:text-primary transition-colors"
					>
						<FiSearch className="w-5 h-5" />
					</button>
					<button
						className="p-2 rounded-md text-content-muted hover:text-primary transition-colors"
						onClick={() => setMobileMenuOpen(true)}
						aria-label={t('common.openMenu')}
					>
						<Bars3Icon className="w-6 h-6" />
					</button>
				</div>
			</nav>

			{/* Mobile menu */}
			<Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
				<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" />
				<DialogPanel className="fixed inset-y-0 right-0 z-50 w-72 bg-surface border-l border-outline shadow-xl px-6 py-6 flex flex-col">
					<div className="flex items-center justify-between mb-8">
						<Logo />
						<button
							onClick={() => setMobileMenuOpen(false)}
							className="p-2 rounded-md text-content-muted hover:text-primary transition-colors"
							aria-label={t('common.closeMenu')}
						>
							<XMarkIcon className="w-5 h-5" />
						</button>
					</div>

					<Sections active={active} onLinkClick={() => setMobileMenuOpen(false)} className="mb-6" />
				</DialogPanel>
			</Dialog>
		</header>
	);
};

export default Navbar;
