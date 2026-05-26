import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import services from '../data/services';

function Services() {
	const { t } = useTranslation();
	return (
		<section id="services" className="py-20 scroll-mt-20">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2 }}
				transition={{ duration: 0.6 }}
				className="mb-12"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('services.eyebrow')}
				</p>
				<h2 className="text-3xl md:text-4xl font-space font-bold text-content mb-3">
					{t('services.title')}
				</h2>
				<p className="text-content-muted max-w-xl">{t('services.subtitle')}</p>
			</motion.div>

			<div className="grid md:grid-cols-3 gap-5">
				{services.map((s, i) => {
					const bullets = t(`services.list.${s.id}.bullets`, { returnObjects: true }) as string[];
					return (
						<motion.article
							key={s.id}
							initial={{ opacity: 0, y: 32 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ amount: 0.2 }}
							transition={{ duration: 0.6, delay: i * 0.12 }}
							className="group flex flex-col rounded-xl bg-surface/70 backdrop-blur border border-outline p-6 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
						>
							<span className="grid place-items-center w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 text-primary mb-4">
								<s.icon className="w-5 h-5" />
							</span>
							<h3 className="text-lg font-space font-semibold text-content mb-2">
								{t(`services.list.${s.id}.title`)}
							</h3>
							<p className="text-sm text-content-muted leading-relaxed mb-3">
								{t(`services.list.${s.id}.summary`)}
							</p>

							{s.price && (
								<div className="inline-flex items-center self-start text-xs font-mono text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-full mb-4">
									{s.price}
								</div>
							)}

							<ul className="space-y-2 mb-6">
								{bullets.map((b) => (
									<li
										key={b}
										className="flex gap-2 text-xs text-content-muted leading-relaxed"
									>
										<FiCheck className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
										{b}
									</li>
								))}
							</ul>

							<a
								href="#contact"
								className="mt-auto inline-flex items-center gap-1.5 text-sm font-space font-medium text-primary hover:gap-2.5 transition-all"
							>
								{t(`services.list.${s.id}.cta`)} <FiArrowRight className="w-4 h-4" />
							</a>
						</motion.article>
					);
				})}
			</div>
		</section>
	);
}

export default Services;
