import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiZap } from 'react-icons/fi';
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
	const headline = t(`experience.entries.${entry.id}.headline`, { defaultValue: '' });
	const isCurrent = !!entry.current;

	// El mes corto sale de la duración ya traducida ("May 2026 – Actual" → "May"),
	// así el sello de fecha acompaña el idioma del sitio.
	const shortMonth = duration.trim().split(/\s+/)[0] ?? '';

	return (
		<div className="relative flex gap-3 sm:gap-4">
			{/* Sello de fecha. Esta columna estaba vacía: el riel arrancaba a un
			    cuarto del ancho y a su izquierda no había nada. */}
			<div className="w-12 sm:w-14 shrink-0 pt-[30px] sm:pt-[34px] text-right">
				{entry.startYear > 0 && (
					<span className="block font-space font-bold text-sm text-content leading-none">
						{entry.startYear}
					</span>
				)}
				<span className="block font-mono text-[11px] text-content-muted mt-1 leading-none">
					{shortMonth}
				</span>
			</div>

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
				{/* La tarjeta entera abre el caso. Antes sólo lo hacía el link chico
				    del pie: un objetivo diminuto en mobile, y con teclado obligaba a
				    tabular hasta el final de cada tarjeta para llegar. */}
				<button
					type="button"
					onClick={onOpen}
					aria-label={`${role} @ ${company} — ${t('experience.viewAchievements')}`}
					className={`group w-full text-left rounded-xl bg-surface/70 backdrop-blur-sm border p-4 sm:p-5 transition-colors focus-visible:outline-none ${
						isCurrent
							? 'border-success/40 hover:border-success/70 focus-visible:border-success'
							: 'border-outline hover:border-primary/40 focus-visible:border-primary/60'
					}`}
				>
					{/* Header: company logo/monogram + role/company/meta + Current badge */}
					<div className="flex items-start gap-3">
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
								<span>{duration}</span>
								<span className="hidden sm:inline">·</span>
								<span>{type}</span>
							</div>
						</div>
					</div>

					{/* El párrafo largo (`details`) vive sólo en el modal. Tenerlo también
					    acá duplicaba el trabajo del modal y estiraba esta sección hasta
					    el 25% de la página entera. */}

					{/* Headline metric */}
					{headline && (
						<div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2">
							<FiZap className="w-4 h-4 text-primary shrink-0" />
							<span className="text-sm text-content font-space">{headline}</span>
						</div>
					)}

					{/* Tech chips with brand-colored icons */}
					<div className="flex flex-wrap items-center gap-1.5 mt-3">
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
						<span className="inline-flex items-center gap-1.5 ml-auto shrink-0 text-xs font-space font-medium text-primary">
							{t('experience.viewAchievements')}
							<FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
						</span>
					</div>
				</button>
			</div>
		</div>
	);
}

export default TimelineItem;
