import { motion } from 'framer-motion';
import { FiArrowUp, FiMail, FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import SocialLinks from './components/SocialLinks';

const EMAIL = 'nahuel.wagner97@gmail.com';
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL;

const navLinks = [
	{ key: 'nav.about', href: '#about' },
	{ key: 'nav.projects', href: '#work' },
	{ key: 'nav.experience', href: '#experience' },
	{ key: 'nav.skills', href: '#skills' },
	{ key: 'nav.contact', href: '#contact' },
] as const;

function Footer() {
	const { t } = useTranslation();
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-outline/40 mt-10 pt-12 pb-8">
			<div className="max-w-5xl w-11/12 mx-auto">
				{/* Final CTA strip — last conversion touchpoint */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ amount: 0.2 }}
					transition={{ duration: 0.6 }}
					className="mb-12 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-surface px-6 py-6 sm:px-8 sm:py-7"
				>
					<div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
						<div>
							<div className="inline-flex items-center gap-2 text-xs font-space font-medium text-success">
								<span className="relative inline-flex w-2 h-2">
									<span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
									<span className="relative w-2 h-2 rounded-full bg-success" />
								</span>
								{t('footer.cta.eyebrow')}
							</div>
							<h3 className="mt-1.5 text-xl md:text-2xl font-space font-bold text-content">
								{t('footer.cta.title')}
							</h3>
							<p className="text-sm text-content-muted mt-1">{t('footer.cta.subtitle')}</p>
						</div>

						<div className="flex flex-wrap gap-2.5">
							<a
								href={`mailto:${EMAIL}`}
								className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-space font-medium bg-primary text-on-accent hover:bg-primary-pressed shadow-lg shadow-primary/20 transition-colors text-sm"
							>
								<FiMail className="w-4 h-4" />
								{t('footer.cta.emailMe')}
							</a>
							{CALENDLY_URL && (
								<a
									href={CALENDLY_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-space font-medium border border-outline text-content hover:border-primary hover:text-primary transition-colors text-sm"
								>
									<FiCalendar className="w-4 h-4" />
									{t('footer.cta.bookCall')}
								</a>
							)}
						</div>
					</div>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8">
					{/* Brand */}
					<div>
						<a href="#" className="inline-flex items-center gap-2.5 group">
							<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-accent font-bold text-sm font-space shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
								NW
							</div>
							<span className="font-space font-semibold text-content text-base">
								nahue<span className="text-primary">.dev</span>
							</span>
						</a>
						<p className="text-sm text-content-muted mt-3 leading-relaxed max-w-xs">
							{t('footer.tagline')}
						</p>
					</div>

					{/* Quick nav */}
					<div>
						<h3 className="text-xs font-space font-semibold text-content-muted uppercase tracking-widest mb-4">
							{t('footer.quickLinks')}
						</h3>
						<ul className="grid grid-cols-2 gap-y-2">
							{navLinks.map((l) => (
								<li key={l.key}>
									<a
										href={l.href}
										className="text-sm text-content-muted hover:text-primary transition-colors font-space"
									>
										{t(l.key)}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Social + back-to-top */}
					<div>
						<h3 className="text-xs font-space font-semibold text-content-muted uppercase tracking-widest mb-4">
							{t('footer.findMe')}
						</h3>
						<div className="flex justify-start">
							<SocialLinks />
						</div>
						<button
							type="button"
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							className="mt-5 inline-flex items-center gap-1.5 text-xs font-space text-content-muted hover:text-primary transition-colors"
						>
							<FiArrowUp className="w-3 h-3" />
							{t('footer.backToTop')}
						</button>
					</div>
				</div>

				<div className="pt-6 border-t border-outline/30 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-content-muted text-center sm:text-left">
					<span>{t('footer.copyright', { year })}</span>
					<span className="font-mono opacity-80">
						{t('footer.updated', { date: __BUILD_DATE__ })}
					</span>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
