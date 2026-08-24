import { lazy, Suspense, useMemo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import portfolio, { type Project, type ProjectCategoryKey } from '../data/portfolio';
import PortfolioItem from './components/PortfolioItem';

// Case-study modal only renders after the first project click — defer the import.
const ProjectModal = lazy(() => import('./components/ProjectModal'));

const categoryKeys = Array.from(new Set(portfolio.map((p) => p.category)));

/**
 * Tarjetas de grilla visibles antes de pedir "ver más". Con el flagship arriba
 * dan 4 proyectos a la vista, que es lo que entra sin obligar a scrollear.
 */
const GRID_PREVIEW = 3;

type Filter = '__all__' | ProjectCategoryKey;

function Portfolio() {
	const { t } = useTranslation();
	const [filter, setFilter] = useState<Filter>('__all__');
	const [expanded, setExpanded] = useState(false);
	const [selected, setSelected] = useState<Project | null>(null);

	/**
	 * El CMS marca varios proyectos como `featured`, pero el tratamiento de
	 * héroe sólo tiene sentido si hay UNO: tres tarjetas anchas seguidas no
	 * leen como jerarquía, leen como el principio de una lista larga. Además
	 * son 2,7 veces menos eficientes en alto por proyecto que la grilla.
	 *
	 * Así que el primer `featured` del filtro actual va a lo ancho y el resto
	 * entra a la grilla como tarjetas normales.
	 */
	const { flagship, rest } = useMemo(() => {
		const items =
			filter === '__all__' ? portfolio : portfolio.filter((p) => p.category === filter);
		const heroIndex = items.findIndex((p) => p.featured);
		if (heroIndex === -1) return { flagship: null, rest: items };
		return { flagship: items[heroIndex], rest: items.filter((_, i) => i !== heroIndex) };
	}, [filter]);

	const shown = expanded ? rest : rest.slice(0, GRID_PREVIEW);
	const hidden = rest.length - shown.length;

	/**
	 * Cambiar de categoría vuelve a colapsar. Si no, al filtrar quedarían
	 * expandidos proyectos que el visitante nunca pidió ver, y el botón
	 * aparecería ya "usado" en una lista que recién empieza.
	 */
	const selectFilter = (id: Filter) => {
		setFilter(id);
		setExpanded(false);
	};

	return (
		<section id="work" className="py-20 scroll-mt-20">
			<m.div
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
			</m.div>

			<div className="flex flex-wrap gap-2 mb-8">
				{[
					{ id: '__all__' as const, label: t('portfolio.filterAll') },
					...categoryKeys.map((c) => ({ id: c, label: t(`portfolio.categories.${c}`) })),
				].map((cat) => (
					<button
						key={cat.id}
						onClick={() => selectFilter(cat.id)}
						aria-pressed={filter === cat.id}
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

			{flagship && (
				<m.div layout className="mb-5">
					<AnimatePresence mode="popLayout">
						<m.div
							key={flagship.id}
							layout
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.96 }}
							transition={{ duration: 0.25, ease: 'easeOut' }}
						>
							<PortfolioItem
								project={flagship}
								hero
								onOpenDetails={() => setSelected(flagship)}
							/>
						</m.div>
					</AnimatePresence>
				</m.div>
			)}

			<m.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				<AnimatePresence mode="popLayout">
					{shown.map((project) => (
						<m.div
							key={project.id}
							layout
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.96 }}
							transition={{ duration: 0.25, ease: 'easeOut' }}
						>
							<PortfolioItem project={project} onOpenDetails={() => setSelected(project)} />
						</m.div>
					))}
				</AnimatePresence>
			</m.div>

			{(hidden > 0 || expanded) && (
				<div className="mt-8 flex justify-center">
					<button
						type="button"
						onClick={() => setExpanded((v) => !v)}
						aria-expanded={expanded}
						aria-controls="work"
						className="px-5 py-2.5 rounded-full text-sm font-space font-medium border border-outline text-content-muted transition-colors hover:text-primary hover:border-primary/50"
					>
						{expanded ? t('portfolio.showLess') : t('portfolio.showMore', { n: hidden })}
					</button>
				</div>
			)}

			{selected && (
				<Suspense fallback={null}>
					<ProjectModal project={selected} onClose={() => setSelected(null)} />
				</Suspense>
			)}
		</section>
	);
}

export default Portfolio;
