import { DialogTitle } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { FiX, FiCalendar, FiZap } from 'react-icons/fi';
import type { TimelineEntry } from '../../data/timeline';
import { techIcons } from '../../data/techIcons';
import Modal from './Modal';
import { Field } from './modalParts';

function ExperienceModal({
	entry,
	onClose,
}: {
	entry: TimelineEntry | null;
	onClose: () => void;
}) {
	return (
		<Modal open={!!entry} onClose={onClose} size="lg">
			{entry && <ExperienceModalContent entry={entry} onClose={onClose} />}
		</Modal>
	);
}

function ExperienceModalContent({
	entry,
	onClose,
}: {
	entry: TimelineEntry;
	onClose: () => void;
}) {
	const { t } = useTranslation();
	const role = t(`experience.entries.${entry.id}.role`);
	const company = t(`experience.entries.${entry.id}.company`);
	const duration = t(`experience.entries.${entry.id}.duration`);
	const type = t(`experience.entries.${entry.id}.type`);
	const details = t(`experience.entries.${entry.id}.details`);
	const headline = t(`experience.entries.${entry.id}.headline`, { defaultValue: '' });
	const achievements = t(`experience.entries.${entry.id}.achievements`, {
		returnObjects: true,
		defaultValue: [],
	}) as string[];

	return (
		<>
			<div className="sticky top-0 z-20 flex items-start justify-between gap-4 px-6 py-4 border-b border-outline bg-surface/95 backdrop-blur-sm">
				<div className="flex items-start gap-3 min-w-0">
					<span
						aria-hidden
						className="grid place-items-center w-11 h-11 rounded-lg bg-linear-to-br from-primary to-secondary text-on-accent font-space font-bold text-base shrink-0 shadow-sm shadow-primary/20"
					>
						{company.charAt(0)}
					</span>
					<div className="min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<DialogTitle className="text-xl font-space font-bold text-content">
								{role}
							</DialogTitle>
							<span className="text-primary font-space text-base font-medium">@ {company}</span>
						</div>
						<div className="flex flex-wrap items-center gap-3 text-xs text-content-muted mt-1">
							<span className="flex items-center gap-1">
								<FiCalendar className="w-3 h-3" />
								{duration}
							</span>
							<span className="hidden sm:inline">·</span>
							<span>{type}</span>
						</div>
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

			<div className="px-6 py-5 space-y-6">
				<p className="text-content-muted leading-relaxed">{details}</p>

				{headline && (
					<div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/15 px-4 py-3">
						<FiZap className="w-4 h-4 text-primary shrink-0" />
						<span className="text-sm text-content font-space">{headline}</span>
					</div>
				)}

				<Field label={t('modal.achievements')}>
					<ol className="space-y-3">
						{achievements.map((item, i) => (
							<li key={item} className="flex gap-3">
								<span className="grid place-items-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono shrink-0 mt-0.5">
									{i + 1}
								</span>
								<p className="text-sm text-content-muted leading-relaxed">{item}</p>
							</li>
						))}
					</ol>
				</Field>

				<Field label={t('modal.stack')}>
					<div className="flex flex-wrap gap-1.5">
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
				</Field>
			</div>
		</>
	);
}

export default ExperienceModal;
