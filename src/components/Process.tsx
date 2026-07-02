import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const STEPS = [
	{ num: '01', id: 'discovery' },
	{ num: '02', id: 'architecture' },
	{ num: '03', id: 'build' },
	{ num: '04', id: 'handover' },
] as const;

function Process() {
	const { t } = useTranslation();
	return (
		<section id="process" className="py-20 scroll-mt-20">
			<m.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2 }}
				transition={{ duration: 0.6 }}
				className="mb-12"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('process.eyebrow')}
				</p>
				<h2 className="text-3xl md:text-4xl font-space font-bold text-content mb-3">
					{t('process.title')}
				</h2>
				<p className="text-content-muted max-w-xl">{t('process.subtitle')}</p>
			</m.div>

			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{STEPS.map((s, i) => (
					<m.div
						key={s.id}
						initial={{ opacity: 0, y: 32 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ amount: 0.2 }}
						transition={{ duration: 0.6, delay: i * 0.12 }}
						className="relative rounded-xl bg-surface/60 backdrop-blur border border-outline p-6 hover:border-primary/40 transition-colors"
					>
						<span className="font-mono text-xs text-primary tracking-widest">{s.num}</span>
						<h3 className="text-base font-space font-semibold text-content mt-3 mb-2">
							{t(`process.steps.${s.id}.title`)}
						</h3>
						<p className="text-sm text-content-muted leading-relaxed">
							{t(`process.steps.${s.id}.summary`)}
						</p>
					</m.div>
				))}
			</div>
		</section>
	);
}

export default Process;
