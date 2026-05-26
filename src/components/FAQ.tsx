import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';

const FAQ_IDS = ['nda', 'bill', 'tz', 'stack', 'design', 'equity'] as const;

function FAQ() {
	const { t } = useTranslation();
	return (
		<section id="faq" className="py-20 scroll-mt-20">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2 }}
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
			</motion.div>

			<div className="max-w-3xl mx-auto space-y-2">
				{FAQ_IDS.map((id) => (
					<Disclosure
						key={id}
						as="div"
						className="rounded-xl bg-surface/60 backdrop-blur border border-outline overflow-hidden hover:border-primary/30 transition-colors"
					>
						<DisclosureButton className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-primary/5 transition-colors">
							<span className="font-space font-medium text-content">
								{t(`faq.items.${id}.q`)}
							</span>
							<FiChevronDown className="w-4 h-4 text-content-muted shrink-0 group-data-[open]:rotate-180 group-data-[open]:text-primary transition-transform duration-200" />
						</DisclosureButton>
						<DisclosurePanel className="px-5 pb-4 text-sm text-content-muted leading-relaxed">
							{t(`faq.items.${id}.a`)}
						</DisclosurePanel>
					</Disclosure>
				))}
			</div>
		</section>
	);
}

export default FAQ;
