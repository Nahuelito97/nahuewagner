import { useTranslation } from 'react-i18next';
import { FiGithub, FiExternalLink, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import type { Project } from '../../data/portfolio';
import { techIcons } from '../../data/techIcons';

interface PortfolioItemProps {
	project: Project;
	onOpenDetails: () => void;
}

function Cover({ project, onClick }: { project: Project; onClick: () => void }) {
	const { t } = useTranslation();
	const main = techIcons[(project.stack[0] ?? '').toLowerCase()];
	const title = t(`portfolio.projects.${project.id}.title`);
	const category = t(`portfolio.categories.${project.category}`);
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={t('portfolio.openLabel', { title })}
			className={`relative block w-full overflow-hidden min-h-44 ${project.featured ? 'md:h-full' : 'h-40'}`}
		>
			{project.imgUrl ? (
				<img
					src={project.imgUrl}
					alt={title}
					loading="lazy"
					decoding="async"
					width={640}
					height={160}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
			) : (
				<div className="w-full h-full min-h-44 bg-linear-to-br from-surface-variant via-surface to-bg flex items-center justify-center p-6">
					{project.logo ? (
						<img
							src={project.logo}
							alt={`${title} logo`}
							loading="lazy"
							decoding="async"
							width={200}
							height={128}
							className="max-h-24 md:max-h-32 max-w-[70%] object-contain opacity-95 transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<span
							className="text-7xl opacity-90 transition-transform duration-500 group-hover:scale-110"
							style={{ color: main?.color }}
						>
							{main?.icon}
						</span>
					)}
				</div>
			)}
			<span
				aria-hidden="true"
				className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-content-muted"
			>
				{category}
			</span>
			{project.tag && (
				<span
					aria-hidden="true"
					className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-space font-medium bg-bg/70 backdrop-blur-sm border border-outline text-primary"
				>
					{t(`portfolio.tags.${project.tag}`)}
				</span>
			)}
		</button>
	);
}

function PortfolioItem({ project, onOpenDetails }: PortfolioItemProps) {
	const { t } = useTranslation();
	const { id, stack, featured } = project;
	const title = t(`portfolio.projects.${id}.title`);
	const tagline = t(`portfolio.projects.${id}.tagline`);
	const description = t(`portfolio.projects.${id}.description`);
	const role = t(`portfolio.projects.${id}.role`);
	const year = t(`portfolio.projects.${id}.year`);
	const heroMetric = t(`portfolio.projects.${id}.heroMetric`, { defaultValue: '' });
	const highlights = t(`portfolio.projects.${id}.highlights`, { returnObjects: true }) as string[];

	return (
		<article
			className={`group flex h-full bg-surface border border-outline rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${
				featured ? 'flex-col md:flex-row' : 'flex-col'
			}`}
		>
			<div className={featured ? 'md:w-2/5 md:shrink-0' : ''}>
				<Cover project={project} onClick={onOpenDetails} />
			</div>

			<div className="flex flex-col flex-1 p-5 gap-3">
				<div>
					<div className="flex items-baseline justify-between gap-3">
						<h3 className="text-lg font-semibold font-space text-content">{title}</h3>
						<span className="text-xs font-mono text-content-muted shrink-0">{year}</span>
					</div>
					<p className="text-xs text-primary font-space mt-0.5">{role}</p>
				</div>

				<p className="text-sm text-content-muted leading-relaxed">
					{featured ? description : tagline}
				</p>

				{heroMetric && (
					<div className="inline-flex items-center gap-1.5 self-start rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-space font-medium text-primary">
						<FiTrendingUp className="w-3.5 h-3.5" />
						{heroMetric}
					</div>
				)}

				{featured && Array.isArray(highlights) && (
					<ul className="space-y-1.5">
						{highlights.slice(0, 3).map((h) => (
							<li key={h} className="flex gap-2 text-xs text-content-muted leading-relaxed">
								<span className="text-primary mt-px shrink-0">▹</span>
								{h}
							</li>
						))}
					</ul>
				)}

				<div className="flex flex-wrap gap-1.5 mt-1">
					{stack.map((item) => {
						const tech = techIcons[item.toLowerCase()];
						return (
							<span
								key={item}
								title={item}
								className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-bg text-xs font-mono text-content-muted border border-outline"
							>
								{tech?.icon && (
									<span className="text-sm" style={{ color: tech.color }}>
										{tech.icon}
									</span>
								)}
								{item}
							</span>
						);
					})}
				</div>

				<div className="mt-auto flex items-center gap-4 pt-1">
					<button
						type="button"
						onClick={onOpenDetails}
						className="flex items-center gap-1.5 text-xs font-space font-medium text-primary hover:gap-2.5 transition-all"
					>
						{t('portfolio.caseStudy')} <FiArrowRight className="w-3.5 h-3.5" />
					</button>
					{project.sourceCodeLink && (
						<a
							href={project.sourceCodeLink}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 text-xs font-space font-medium text-content-muted hover:text-primary transition-colors"
						>
							<FiGithub className="w-4 h-4" />
							{t('common.source')}
						</a>
					)}
					{project.link && (
						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 text-xs font-space font-medium text-content-muted hover:text-primary transition-colors"
						>
							<FiExternalLink className="w-4 h-4" />
							{t(`portfolio.projects.${id}.linkLabel`, { defaultValue: t('common.live') })}
						</a>
					)}
				</div>
			</div>
		</article>
	);
}

export default PortfolioItem;
