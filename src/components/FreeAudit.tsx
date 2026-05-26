import { motion } from 'framer-motion';
import { FiVideo, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL;

/**
 * Lead-magnet card: a free 30-min audit call. Renders nothing until
 * VITE_CALENDLY_URL is set (so the section never lands without a working CTA).
 */
function FreeAudit() {
	const { t } = useTranslation();
	if (!CALENDLY_URL) return null;

	const bullets = t('freeAudit.bullets', { returnObjects: true }) as string[];

	return (
		<section className="py-16 scroll-mt-20">
			<motion.div
				initial={{ opacity: 0, y: 48 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2 }}
				transition={{ duration: 0.7 }}
				className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-surface p-7 md:p-10"
			>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -top-24 -right-12 h-64 w-64 rounded-full bg-primary/20 blur-[90px]"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-secondary/20 blur-[100px]"
				/>

				<div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
					<div>
						<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
							{t('freeAudit.eyebrow')}
						</p>
						<h2 className="text-2xl md:text-3xl font-space font-bold text-content mb-3">
							{t('freeAudit.title')}
						</h2>
						<p className="text-content-muted leading-relaxed max-w-2xl mb-5">
							{t('freeAudit.subtitle')}
						</p>
						<ul className="space-y-2 mb-5">
							{Array.isArray(bullets) &&
								bullets.map((b) => (
									<li key={b} className="flex gap-2 text-sm text-content-muted leading-relaxed">
										<FiCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
										{b}
									</li>
								))}
						</ul>
						<p className="text-xs text-content-muted italic">{t('freeAudit.footnote')}</p>
					</div>

					<a
						href={CALENDLY_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-space font-medium bg-primary text-on-accent hover:bg-primary-pressed shadow-xl shadow-primary/30 transition-all whitespace-nowrap"
					>
						<FiVideo className="w-4 h-4" />
						{t('freeAudit.cta')}
						<FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
					</a>
				</div>
			</motion.div>
		</section>
	);
}

export default FreeAudit;
