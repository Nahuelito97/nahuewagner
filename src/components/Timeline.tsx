import { lazy, Suspense, useState } from 'react';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import timeline, { type TimelineEntry } from '../data/timeline';
import TimelineItem from './components/TimelineItem';

const ExperienceModal = lazy(() => import('./components/ExperienceModal'));

function Timeline() {
	const { t } = useTranslation();
	const [selected, setSelected] = useState<TimelineEntry | null>(null);

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
				{timeline.map((item, index) => (
					<TimelineItem
						key={item.id}
						entry={item}
						isLast={index === timeline.length - 1}
						onOpen={() => setSelected(item)}
					/>
				))}
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
