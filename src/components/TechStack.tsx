import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import skills from '../data/skills';

function TechStack() {
	const { t } = useTranslation();
	return (
		<section id="skills" className="py-20 scroll-mt-20">
			<m.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2, once: true }}
				transition={{ duration: 0.6 }}
				className="mb-10"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('skills.eyebrow')}
				</p>
				<h2 className="text-3xl md:text-4xl font-space font-bold text-content mb-3">
					{t('skills.title')}
				</h2>
				<p className="text-content-muted max-w-xl">{t('skills.subtitle')}</p>
			</m.div>

			<div className="grid sm:grid-cols-2 gap-4">
				{Object.entries(skills).map(([category, { techs }], i) => {
					const primaryCount = techs.filter((tech) => tech.primary).length;
					return (
						<m.div
							key={category}
							initial={{ opacity: 0, y: 32 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ amount: 0.2, once: true }}
							transition={{ duration: 0.6, delay: i * 0.12 }}
							className="rounded-xl bg-surface/60 backdrop-blur-sm border border-outline p-5 hover:border-primary/40 transition-colors"
						>
							<div className="flex items-baseline justify-between mb-1">
								<h3 className="text-sm font-space font-semibold text-content-muted uppercase tracking-widest">
									{category}
								</h3>
								<span className="text-xs font-mono text-content-muted/60">
									{primaryCount}/{techs.length}
								</span>
							</div>
							<p className="text-xs text-content-muted/80 mb-4">
								{t(`skills.categories.${category}`)}
							</p>
							<div className="flex flex-wrap gap-1.5">
								{techs.map((tech) => (
									<span
										key={tech.name}
										className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-sm font-space transition-colors hover:border-primary/40 ${
											tech.primary
												? 'bg-primary/10 border-primary/30 text-content'
												: 'bg-bg/60 border-outline text-content-muted hover:text-content'
										}`}
									>
										<tech.icon className="text-base" style={{ color: tech.color }} />
										{tech.name}
									</span>
								))}
							</div>
						</m.div>
					);
				})}
			</div>
		</section>
	);
}

export default TechStack;
