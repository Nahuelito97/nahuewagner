import { useTranslation } from 'react-i18next';

interface SectionsProps {
	onLinkClick?: () => void;
	className?: string;
	active?: string;
}

const NAV_ITEMS = [
	{ key: 'about', href: '#about' },
	{ key: 'services', href: '#services' },
	{ key: 'projects', href: '#work' },
	{ key: 'experience', href: '#experience' },
	{ key: 'skills', href: '#skills' },
	{ key: 'contact', href: '#contact' },
];

const Sections = ({ onLinkClick, className = '', active }: SectionsProps) => {
	const { t } = useTranslation();
	return (
		<ul className={`flex flex-col md:flex-row md:space-x-1 space-y-1 md:space-y-0 ${className}`}>
			{NAV_ITEMS.map((item) => {
				const isActive = active === item.href.slice(1);
				return (
					<li key={item.key}>
						<a
							href={item.href}
							onClick={onLinkClick}
							aria-current={isActive ? 'true' : undefined}
							className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 font-space ${
								isActive
									? 'text-primary bg-primary/10'
									: 'text-content-muted hover:text-primary hover:bg-primary/10'
							}`}
						>
							{t(`nav.${item.key}`)}
						</a>
					</li>
				);
			})}
		</ul>
	);
};

export default Sections;
