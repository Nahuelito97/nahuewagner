import { m } from 'framer-motion';
import type { IconType } from 'react-icons';
import { FiClock, FiShield, FiTool, FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const ITEMS: { id: string; icon: IconType }[] = [
	{ id: 'reply', icon: FiClock },
	{ id: 'nda', icon: FiShield },
	{ id: 'bugfix', icon: FiTool },
	{ id: 'availability', icon: FiCalendar },
];

function Commitments() {
	const { t } = useTranslation();

	return (
		<section className="py-12">
			<m.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2 }}
				transition={{ duration: 0.6 }}
				className="mb-8"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('commitments.eyebrow')}
				</p>
				<h2 className="text-2xl md:text-3xl font-space font-bold text-content">
					{t('commitments.title')}
				</h2>
			</m.div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{ITEMS.map((it, i) => {
					const Icon = it.icon;
					return (
						<m.div
							key={it.id}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ amount: 0.2 }}
							transition={{ duration: 0.55, delay: i * 0.12 }}
							className="flex items-start gap-3 rounded-xl border border-outline bg-surface/60 backdrop-blur p-4 hover:border-primary/40 transition-colors"
						>
							<span className="grid place-items-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
								<Icon className="w-4 h-4" />
							</span>
							<div className="min-w-0">
								<div className="text-sm font-space font-semibold text-content leading-snug">
									{t(`commitments.items.${it.id}.title`)}
								</div>
								<p className="text-xs text-content-muted mt-0.5 leading-relaxed">
									{t(`commitments.items.${it.id}.summary`)}
								</p>
							</div>
						</m.div>
					);
				})}
			</div>
		</section>
	);
}

export default Commitments;
