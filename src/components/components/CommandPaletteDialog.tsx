import { useMemo, useState } from 'react';
import {
	Dialog,
	DialogPanel,
	Combobox,
	ComboboxInput,
	ComboboxOptions,
	ComboboxOption,
} from '@headlessui/react';
import type { IconType } from 'react-icons';
import {
	FiSearch,
	FiUser,
	FiFolder,
	FiBriefcase,
	FiCpu,
	FiMessageSquare,
	FiMail,
	FiDownload,
	FiGithub,
	FiLinkedin,
	FiZap,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface Command {
	id: string;
	label: string;
	hint?: string;
	icon: IconType;
	action: () => void;
}

interface Props {
	onClose: () => void;
}

const scrollTo = (id: string) => () =>
	document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
const openUrl = (url: string) => () => window.open(url, '_blank', 'noopener,noreferrer');

function CommandPaletteDialog({ onClose }: Props) {
	const { t } = useTranslation();
	const [query, setQuery] = useState('');

	const commands = useMemo<Command[]>(
		() => [
			{ id: 'about', label: t('palette.items.about'), icon: FiUser, action: scrollTo('about') },
			{ id: 'services', label: t('palette.items.services'), icon: FiZap, action: scrollTo('services') },
			{ id: 'work', label: t('palette.items.work'), icon: FiFolder, action: scrollTo('work') },
			{ id: 'experience', label: t('palette.items.experience'), icon: FiBriefcase, action: scrollTo('experience') },
			{ id: 'skills', label: t('palette.items.skills'), icon: FiCpu, action: scrollTo('skills') },
			{ id: 'testimonials', label: t('palette.items.testimonials'), icon: FiMessageSquare, action: scrollTo('testimonials') },
			{ id: 'contact', label: t('palette.items.contact'), icon: FiMail, action: scrollTo('contact') },
			{ id: 'cv', label: t('palette.items.cv'), hint: 'PDF', icon: FiDownload, action: openUrl('/docs/Nahuel-Wagner-CV.pdf') },
			{
				id: 'email',
				label: t('palette.items.email'),
				icon: FiMail,
				action: () => {
					window.location.href = 'mailto:nahuel.wagner97@gmail.com';
				},
			},
			{ id: 'github', label: t('palette.items.github'), hint: '↗', icon: FiGithub, action: openUrl('https://github.com/Nahuelito97') },
			{
				id: 'linkedin',
				label: t('palette.items.linkedin'),
				hint: '↗',
				icon: FiLinkedin,
				action: openUrl('https://www.linkedin.com/in/nahuewagner/'),
			},
		],
		[t],
	);

	const run = (cmd: Command | null) => {
		if (!cmd) return;
		onClose();
		cmd.action();
	};

	const filtered = query
		? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
		: commands;

	return (
		<Dialog open onClose={onClose} className="relative z-70">
			<div className="fixed inset-0 bg-black/50 backdrop-blur-xs" aria-hidden="true" />
			<div className="fixed inset-0 flex items-start justify-center p-4 pt-[15vh]">
				<DialogPanel className="w-full max-w-lg rounded-xl border border-outline bg-surface shadow-2xl shadow-black/40 overflow-hidden">
					<Combobox<Command | null> value={null} onChange={run}>
						<div className="flex items-center gap-2.5 border-b border-outline px-4">
							<FiSearch className="text-content-muted shrink-0" />
							<ComboboxInput
								autoFocus
								onChange={(e) => setQuery(e.target.value)}
								placeholder={t('palette.placeholder')}
								className="w-full bg-transparent py-3.5 text-content placeholder-content-muted/70 focus:outline-hidden"
							/>
							<kbd className="text-[10px] font-mono text-content-muted border border-outline rounded-sm px-1.5 py-0.5 shrink-0">
								{t('palette.esc')}
							</kbd>
						</div>
						<ComboboxOptions static className="max-h-80 overflow-y-auto p-2">
							{filtered.length === 0 ? (
								<div className="px-3 py-6 text-center text-sm text-content-muted">
									{t('palette.noResults')}
								</div>
							) : (
								filtered.map((cmd) => (
									<ComboboxOption
										key={cmd.id}
										value={cmd}
										className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-content-muted data-focus:bg-primary/10 data-focus:text-primary"
									>
										<cmd.icon className="w-4 h-4 shrink-0" />
										<span className="text-sm">{cmd.label}</span>
										{cmd.hint && (
											<span className="ml-auto text-xs text-content-muted group-data-focus:text-primary/70">
												{cmd.hint}
											</span>
										)}
									</ComboboxOption>
								))
							)}
						</ComboboxOptions>
					</Combobox>
				</DialogPanel>
			</div>
		</Dialog>
	);
}

export default CommandPaletteDialog;
