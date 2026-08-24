import { useState } from 'react';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';

const FAQ_IDS = ['nda', 'bill', 'tz', 'stack', 'design', 'equity'] as const;

function FAQItem({ id }: { id: (typeof FAQ_IDS)[number] }) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<div className="rounded-xl bg-surface/60 backdrop-blur-sm border border-outline overflow-hidden hover:border-primary/30 transition-colors">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				aria-controls={`faq-panel-${id}`}
				className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-primary/5 transition-colors"
			>
				<span className="font-space font-medium text-content">{t(`faq.items.${id}.q`)}</span>
				<FiChevronDown
					className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
						open ? 'rotate-180 text-primary' : 'text-content-muted'
					}`}
				/>
			</button>
			{open && (
				<div id={`faq-panel-${id}`} className="px-5 pb-4 text-sm text-content-muted leading-relaxed">
					{t(`faq.items.${id}.a`)}
				</div>
			)}
		</div>
	);
}

function FAQ() {
	const { t } = useTranslation();
	return (
		<section id="faq" className="py-20 scroll-mt-20">
			<m.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2, once: true }}
				transition={{ duration: 0.6 }}
				className="mb-12"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('faq.eyebrow')}
				</p>
				<h2 className="text-3xl md:text-4xl font-space font-bold text-content mb-3">
					{t('faq.title')}
				</h2>
				<p className="text-content-muted max-w-xl">{t('faq.subtitle')}</p>
			</m.div>

			<div className="max-w-3xl mx-auto space-y-2">
				{FAQ_IDS.map((id) => (
					<FAQItem key={id} id={id} />
				))}
			</div>
		</section>
	);
}

export default FAQ;
