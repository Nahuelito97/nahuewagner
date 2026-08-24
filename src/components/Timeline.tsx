import { lazy, Suspense, useState } from 'react';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import timeline, { type TimelineEntry } from '../data/timeline';
import TimelineItem from './components/TimelineItem';

const ExperienceModal = lazy(() => import('./components/ExperienceModal'));

/** Roles visibles antes de pedir "ver más". */
const PREVIEW = 3;

function Timeline() {
	const { t } = useTranslation();
	const [selected, setSelected] = useState<TimelineEntry | null>(null);
	const [expanded, setExpanded] = useState(false);

	const shown = expanded ? timeline : timeline.slice(0, PREVIEW);
	const hidden = timeline.length - shown.length;

	return (
		<section id="experience" className="py-20 scroll-mt-20">
			<m.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2, once: true }}
				transition={{ duration: 0.6 }}
				className="mb-12"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('experience.eyebrow')}
				</p>
				<h2 className="text-3xl md:text-4xl font-space font-bold text-content mb-3">
					{t('experience.title')}
				</h2>
				<p className="text-content-muted max-w-xl">{t('experience.subtitle')}</p>
			</m.div>

			<m.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ amount: 0.2, once: true }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="max-w-3xl mx-auto"
			>
				{shown.map((item, index) => (
					<TimelineItem
						key={item.id}
						entry={item}
						// El riel se corta en la última VISIBLE, no en la última del
						// listado completo: si no, colgaría en el aire bajo el botón.
						isLast={index === shown.length - 1}
						onOpen={() => setSelected(item)}
					/>
				))}

				{(hidden > 0 || expanded) && (
					<div className="flex justify-center">
						<button
							type="button"
							onClick={() => setExpanded((v) => !v)}
							aria-expanded={expanded}
							className="px-5 py-2.5 rounded-full text-sm font-space font-medium border border-outline text-content-muted transition-colors hover:text-primary hover:border-primary/50"
						>
							{expanded ? t('experience.showLess') : t('experience.showMore', { n: hidden })}
						</button>
					</div>
				)}
			</m.div>

			{selected && (
				<Suspense fallback={null}>
					<ExperienceModal entry={selected} onClose={() => setSelected(null)} />
				</Suspense>
			)}
		</section>
	);
}

export default Timeline;
