import { lazy, Suspense, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import portfolio, { type Project, type ProjectCategoryKey } from '../data/portfolio';
import PortfolioItem from './components/PortfolioItem';

// Case-study modal only renders after the first project click — defer the import.
const ProjectModal = lazy(() => import('./components/ProjectModal'));

const categoryKeys = Array.from(new Set(portfolio.map((p) => p.category)));

function Portfolio() {
	const { t } = useTranslation();
	const [filter, setFilter] = useState<'__all__' | ProjectCategoryKey>('__all__');
	const [selected, setSelected] = useState<Project | null>(null);

	const visible = useMemo(
		() =>
			filter === '__all__' ? portfolio : portfolio.filter((p) => p.category === filter),
		[filter],
	);

	return (
		<section id="work" className="py-20 scroll-mt-20">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2 }}
				transition={{ duration: 0.6 }}
				className="mb-8"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('portfolio.eyebrow')}
				</p>
				<h2 className="text-3xl md:text-4xl font-space font-bold text-content mb-3">
					{t('portfolio.title')}
				</h2>
				<p className="text-content-muted max-w-xl">{t('portfolio.subtitle')}</p>
			</motion.div>

			<div className="flex flex-wrap gap-2 mb-8">
				{(
					[
						{ id: '__all__' as const, label: t('portfolio.filterAll') },
						...categoryKeys.map((c) => ({ id: c, label: t(`portfolio.categories.${c}`) })),
					]
				).map((cat) => (
					<button
						key={cat.id}
						onClick={() => setFilter(cat.id)}
						className={`px-3 py-1.5 rounded-full text-xs font-space font-medium border transition-colors ${
							filter === cat.id
								? 'bg-primary text-on-accent border-primary'
								: 'border-outline text-content-muted hover:text-primary hover:border-primary/50'
						}`}
					>
						{cat.label}
					</button>
				))}
			</div>

			<motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
				<AnimatePresence mode="popLayout">
					{visible.map((project) => (
						<motion.div
							key={project.id}
							layout
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.96 }}
							transition={{ duration: 0.25, ease: 'easeOut' }}
							className={project.featured ? 'md:col-span-2' : ''}
						>
							<PortfolioItem project={project} onOpenDetails={() => setSelected(project)} />
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>

			{selected && (
				<Suspense fallback={null}>
					<ProjectModal project={selected} onClose={() => setSelected(null)} />
				</Suspense>
			)}
		</section>
	);
}

export default Portfolio;
