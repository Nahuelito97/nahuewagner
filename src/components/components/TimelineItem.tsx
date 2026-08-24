import { useTranslation } from 'react-i18next';
import { FiCalendar, FiArrowRight, FiZap } from 'react-icons/fi';
import type { TimelineEntry } from '../../data/timeline';
import { techIcons } from '../../data/techIcons';

interface TimelineItemProps {
	entry: TimelineEntry;
	isLast: boolean;
	onOpen: () => void;
}

function CompanyMark({ entry, company }: { entry: TimelineEntry; company: string }) {
	if (entry.logo) {
		return (
			<span className="grid place-items-center w-10 h-10 rounded-lg bg-bg/60 border border-outline p-1.5 shrink-0">
				<img
					src={entry.logo}
					alt={`${company} logo`}
					loading="lazy"
					decoding="async"
					width={40}
					height={40}
					className="max-w-full max-h-full object-contain"
				/>
			</span>
		);
	}
	return (
		<span
			aria-hidden
			className="grid place-items-center w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary text-on-accent font-space font-bold text-base shrink-0 shadow-sm shadow-primary/20"
		>
			{company.charAt(0)}
		</span>
	);
}

function TimelineItem({ entry, isLast, onOpen }: TimelineItemProps) {
	const { t } = useTranslation();
	const role = t(`experience.entries.${entry.id}.role`);
	const company = t(`experience.entries.${entry.id}.company`);
	const duration = t(`experience.entries.${entry.id}.duration`);
	const type = t(`experience.entries.${entry.id}.type`);
	const details = t(`experience.entries.${entry.id}.details`);
	const headline = t(`experience.entries.${entry.id}.headline`, { defaultValue: '' });
	const isCurrent = !!entry.current;

	return (
		<div className="relative flex gap-4 sm:gap-6">
			{/* Line + dot — aligned vertically with the monogram center */}
			<div className="flex flex-col items-center pt-[30px] sm:pt-[34px]">
				<span className="relative inline-flex">
					{isCurrent && (
						<span className="absolute inset-0 w-3 h-3 rounded-full bg-success animate-ping opacity-75" />
					)}
					<span
						className={`relative w-3 h-3 rounded-full ring-4 ring-bg z-10 ${
							isCurrent ? 'bg-success' : 'bg-primary'
						}`}
					/>
				</span>
				{!isLast && <div className="w-px flex-1 bg-outline mt-2" />}
			</div>

			{/* Card */}
			<div className="pb-10 flex-1 min-w-0">
				<div className="rounded-xl bg-surface/70 backdrop-blur-sm border border-outline p-4 sm:p-5 hover:border-primary/40 transition-colors">
					{/* Header: company logo/monogram + role/company/meta + Current badge */}
					<div className="flex items-start gap-3 mb-3">
						<CompanyMark entry={entry} company={company} />
						<div className="flex-1 min-w-0">
							<div className="flex flex-wrap items-start justify-between gap-2">
								<h3 className="font-space font-semibold text-content text-base leading-snug">
									{role}
									<span className="text-primary font-medium"> @ {company}</span>
								</h3>
								{isCurrent && (
									<span className="self-start shrink-0 inline-flex items-center gap-1.5 text-[10px] font-space font-medium text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
										<span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
										{t('common.current')}
									</span>
								)}
							</div>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-content-muted mt-1">
								<span className="flex items-center gap-1">
									<FiCalendar className="w-3 h-3" />
									{duration}
								</span>
								<span className="hidden sm:inline">·</span>
								<span>{type}</span>
							</div>
						</div>
					</div>

					<p className="text-sm text-content-muted leading-relaxed">{details}</p>

					{/* Headline metric */}
					{headline && (
						<div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2">
							<FiZap className="w-4 h-4 text-primary shrink-0" />
							<span className="text-sm text-content font-space">{headline}</span>
						</div>
					)}

					{/* Tech chips with brand-colored icons */}
					<div className="flex flex-wrap gap-1.5 mt-3">
						{entry.tech.map((techName) => {
							const tech = techIcons[techName.toLowerCase()];
							return (
								<span
									key={techName}
									className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-primary/10 text-primary border border-primary/20"
								>
									{tech?.icon && (
										<span className="text-sm" style={{ color: tech.color }}>
											{tech.icon}
										</span>
									)}
									{techName}
								</span>
							);
						})}
					</div>

					<button
						type="button"
						onClick={onOpen}
						className="mt-4 inline-flex items-center gap-1.5 text-xs font-space font-medium text-primary hover:gap-2.5 transition-all"
					>
						{t('experience.viewAchievements')} <FiArrowRight className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>
		</div>
	);
}

export default TimelineItem;
