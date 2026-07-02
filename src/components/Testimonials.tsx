import { m } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import testimonials from '../data/testimonials';

function Testimonials() {
	const { t } = useTranslation();
	return (
		<section id="testimonials" className="py-20 scroll-mt-20">
			<m.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2 }}
				transition={{ duration: 0.6 }}
				className="mb-12"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('testimonials.eyebrow')}
				</p>
				<h2 className="text-3xl md:text-4xl font-space font-bold text-content mb-3">
					{t('testimonials.title')}
				</h2>
			</m.div>

			<div className="grid md:grid-cols-3 gap-5">
				{testimonials.map((t, i) => (
					<m.div
						key={t.name}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ amount: 0.2 }}
						transition={{ duration: 0.6, delay: i * 0.15 }}
						className="flex flex-col h-full rounded-xl bg-surface border border-outline p-5"
					>
						<FaQuoteLeft className="text-primary/60 w-6 h-6 mb-3" />
						<p className="text-sm text-content-muted leading-relaxed mb-4">{t.quote}</p>
						<div className="flex items-center gap-3 mt-auto">
							<div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-accent font-space font-bold text-sm shrink-0">
								{t.name.charAt(0)}
							</div>
							<div className="min-w-0">
								<div className="text-sm font-space font-medium text-content truncate">{t.name}</div>
								<div className="text-xs text-content-muted truncate">
									{t.role}
									{t.company ? ` · ${t.company}` : ''}
								</div>
							</div>
						</div>
					</m.div>
				))}
			</div>
		</section>
	);
}

export default Testimonials;
