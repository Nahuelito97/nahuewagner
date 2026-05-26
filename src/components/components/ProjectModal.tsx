import { DialogTitle } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { FiX, FiGithub, FiExternalLink, FiCheck, FiUsers, FiTrendingUp } from 'react-icons/fi';
import type { Project } from '../../data/portfolio';
import { techIcons } from '../../data/techIcons';
import Modal from './Modal';
import { Field, Bullets } from './modalParts';

function Hero({ project, title }: { project: Project; title: string }) {
	const main = techIcons[(project.stack[0] ?? '').toLowerCase()];

	if (project.imgUrl) {
		return (
			<div className="relative h-56 overflow-hidden bg-bg">
				<img
					src={project.imgUrl}
					alt={title}
					loading="lazy"
					decoding="async"
					width={1024}
					height={224}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
			</div>
		);
	}

	if (project.modalImage) {
		return (
			<div className="relative h-72 overflow-hidden bg-bg">
				<div className="absolute inset-0 bg-gradient-to-br from-surface-variant/40 via-bg to-bg" />
				<div className="relative h-full flex items-center justify-center">
					<img
						src={project.modalImage}
						alt={title}
						loading="lazy"
						decoding="async"
						width={280}
						height={280}
						className="h-full max-h-[280px] object-contain drop-shadow-2xl"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-44 bg-gradient-to-br from-surface-variant via-surface to-bg flex items-center justify-center p-6">
			{project.logo ? (
				<img
					src={project.logo}
					alt={`${title} logo`}
					loading="lazy"
					decoding="async"
					width={240}
					height={112}
					className="max-h-28 max-w-[60%] object-contain"
				/>
			) : (
				<span className="text-8xl opacity-90" style={{ color: main?.color }}>
					{main?.icon}
				</span>
			)}
		</div>
	);
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
	return (
		<Modal open={!!project} onClose={onClose} size="xl">
			{project && <ProjectModalContent project={project} onClose={onClose} />}
		</Modal>
	);
}

function ProjectModalContent({ project, onClose }: { project: Project; onClose: () => void }) {
	const { t } = useTranslation();
	const { id } = project;
	const title = t(`portfolio.projects.${id}.title`);
	const role = t(`portfolio.projects.${id}.role`);
	const year = t(`portfolio.projects.${id}.year`);
	const description = t(`portfolio.projects.${id}.description`);
	const heroMetric = t(`portfolio.projects.${id}.heroMetric`, { defaultValue: '' });
	const problem = t(`portfolio.projects.${id}.problem`, { defaultValue: '' });
	const solution = t(`portfolio.projects.${id}.solution`, { defaultValue: '' });
	const myRole = t(`portfolio.projects.${id}.myRole`, {
		returnObjects: true,
		defaultValue: [],
	}) as string[];
	const outcomes = t(`portfolio.projects.${id}.outcomes`, {
		returnObjects: true,
		defaultValue: [],
	}) as string[];
	const highlights = t(`portfolio.projects.${id}.highlights`, {
		returnObjects: true,
		defaultValue: [],
	}) as string[];
	const team = t(`portfolio.projects.${id}.team`, { defaultValue: '' });

	return (
		<>
			<div className="sticky top-0 z-20 flex items-start justify-between gap-4 px-6 py-4 border-b border-outline bg-surface/95 backdrop-blur">
				<div className="flex items-start gap-3 min-w-0">
					{project.logo && (
						<div className="grid place-items-center w-11 h-11 rounded-lg bg-bg/60 border border-outline shrink-0 p-1.5">
							<img
								src={project.logo}
								alt=""
								aria-hidden
								loading="lazy"
								decoding="async"
								width={32}
								height={32}
								className="max-w-full max-h-full object-contain"
							/>
						</div>
					)}
					<div className="min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<DialogTitle className="text-xl font-space font-bold text-content">
								{title}
							</DialogTitle>
							{project.tag && (
								<span className="px-2 py-0.5 rounded-full text-[10px] font-space font-medium bg-primary/10 border border-primary/20 text-primary">
									{t(`portfolio.tags.${project.tag}`)}
								</span>
							)}
						</div>
						<p className="text-xs text-primary font-space mt-0.5">
							{role} · {year}
						</p>
					</div>
				</div>
				<button
					onClick={onClose}
					aria-label={t('common.close')}
					className="p-2 rounded-lg text-content-muted hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
				>
					<FiX className="w-5 h-5" />
				</button>
			</div>

			<Hero project={project} title={title} />

			<div className="px-6 py-6 space-y-7">
				{heroMetric && (
					<div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
						<FiTrendingUp className="w-5 h-5 text-primary shrink-0" />
						<span className="text-base font-space font-semibold text-content">
							{heroMetric}
						</span>
					</div>
				)}

				<p className="text-content-muted leading-relaxed">{description}</p>

				{(problem || solution) && (
					<div className="grid md:grid-cols-2 gap-3">
						{problem && (
							<div className="rounded-lg border border-outline bg-bg/40 p-4">
								<div className="text-[10px] font-mono uppercase tracking-widest text-content-muted mb-2">
									{t('modal.problem')}
								</div>
								<p className="text-sm text-content leading-relaxed">{problem}</p>
							</div>
						)}
						{solution && (
							<div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
								<div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">
									{t('modal.solution')}
								</div>
								<p className="text-sm text-content leading-relaxed">{solution}</p>
							</div>
						)}
					</div>
				)}

				{myRole.length > 0 && (
					<Field label={t('modal.myRole')}>
						<ul className="space-y-2">
							{myRole.map((r) => (
								<li key={r} className="flex gap-2 text-sm text-content-muted leading-relaxed">
									<FiCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
									{r}
								</li>
							))}
						</ul>
					</Field>
				)}

				{outcomes.length > 0 && (
					<Field label={t('modal.outcomes')}>
						<div className="grid sm:grid-cols-2 gap-2.5">
							{outcomes.map((o) => (
								<div
									key={o}
									className="flex gap-2 rounded-lg border border-success/20 bg-success/5 p-3"
								>
									<FiCheck className="w-4 h-4 text-success mt-0.5 shrink-0" />
									<span className="text-sm text-content">{o}</span>
								</div>
							))}
						</div>
					</Field>
				)}

				<Field label={t('modal.highlights')}>
					<Bullets items={highlights} />
				</Field>

				<Field label={t('modal.stack')}>
					<div className="flex flex-wrap gap-1.5">
						{project.stack.map((item) => {
							const tech = techIcons[item.toLowerCase()];
							return (
								<span
									key={item}
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
				</Field>

				{team && (
					<div className="flex items-center gap-2 rounded-lg bg-surface-variant/30 border border-outline px-4 py-3">
						<FiUsers className="w-4 h-4 text-content-muted shrink-0" />
						<span className="text-sm text-content-muted">{team}</span>
					</div>
				)}

				{(project.sourceCodeLink || project.link) && (
					<div className="flex flex-wrap gap-3 pt-1">
						{project.sourceCodeLink && (
							<a
								href={project.sourceCodeLink}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline text-sm font-space font-medium text-content hover:border-primary hover:text-primary transition-colors"
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
								className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-accent text-sm font-space font-medium hover:bg-primary-pressed transition-colors"
							>
								<FiExternalLink className="w-4 h-4" />
								{t(`portfolio.projects.${id}.linkLabel`, { defaultValue: t('common.live') })}
							</a>
						)}
					</div>
				)}
			</div>
		</>
	);
}

export default ProjectModal;
