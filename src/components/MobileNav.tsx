import { FiUser, FiFolder, FiBriefcase, FiCpu, FiMail } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useActiveSection } from '../hooks/useActiveSection';

const SECTION_IDS = ['about', 'work', 'experience', 'skills', 'contact'];

const items = [
	{ id: 'about', key: 'mobileNav.about', icon: FiUser },
	{ id: 'work', key: 'mobileNav.work', icon: FiFolder },
	{ id: 'experience', key: 'mobileNav.experience', icon: FiBriefcase },
	{ id: 'skills', key: 'mobileNav.skills', icon: FiCpu },
	{ id: 'contact', key: 'mobileNav.contact', icon: FiMail },
] as const;

function MobileNav() {
	const { t } = useTranslation();
	const active = useActiveSection(SECTION_IDS);

	return (
		<nav
			aria-label={t('mobileNav.ariaLabel')}
			className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg/90 backdrop-blur-md border-t border-outline"
		>
			<ul className="flex items-stretch justify-around max-w-md mx-auto">
				{items.map((it) => {
					const isActive = active === it.id;
					return (
						<li key={it.id} className="flex-1">
							<a
								href={`#${it.id}`}
								aria-current={isActive ? 'true' : undefined}
								className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-space transition-colors ${
									isActive ? 'text-primary' : 'text-content-muted hover:text-primary'
								}`}
							>
								<it.icon className="w-5 h-5" />
								{t(it.key)}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

export default MobileNav;
