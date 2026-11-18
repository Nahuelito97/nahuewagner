import { useState, type FormEvent } from 'react';
import { m } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
	FiMail,
	FiMapPin,
	FiGithub,
	FiLinkedin,
	FiArrowRight,
	FiCheckCircle,
	FiAlertCircle,
	FiCalendar,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

type Status = 'idle' | 'sending' | 'success' | 'error';

const EMAIL = 'nahuel.wagner97@gmail.com';
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL;
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL;

// Form select option keys (values sent to the backend stay in English for stable payloads).
const REASON_KEYS = ['job', 'freelance', 'collaboration', 'question', 'other'] as const;
const REASON_VALUES: Record<(typeof REASON_KEYS)[number], string> = {
	job: 'Job opportunity',
	freelance: 'Freelance project',
	collaboration: 'Collaboration',
	question: 'Question',
	other: 'Other',
};
const PROJECT_TYPE_KEYS = [
	'backend',
	'fullstack',
	'frontend',
	'mobile',
	'architecture',
	'other',
] as const;
const PROJECT_TYPE_VALUES: Record<(typeof PROJECT_TYPE_KEYS)[number], string> = {
	backend: 'Backend',
	fullstack: 'Full-stack',
	frontend: 'Frontend',
	mobile: 'Mobile',
	architecture: 'Architecture / consulting',
	other: 'Other',
};

function Method({
	icon: Icon,
	label,
	value,
	href,
}: {
	icon: IconType;
	label: string;
	value: string;
	href?: string;
}) {
	const className =
		'group flex items-center gap-3 rounded-lg border border-outline bg-surface/40 px-4 py-3 hover:border-primary/40 transition-colors';
	const inner = (
		<>
			<span className="grid place-items-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
				<Icon className="w-4 h-4" />
			</span>
			<div className="min-w-0">
				<div className="text-[10px] font-mono uppercase tracking-widest text-content-muted">
					{label}
				</div>
				<div className="text-sm font-space text-content truncate group-hover:text-primary transition-colors">
					{value}
				</div>
			</div>
		</>
	);
	return href ? (
		<a href={href} target="_blank" rel="noopener noreferrer" className={className}>
			{inner}
		</a>
	) : (
		<div className={className}>{inner}</div>
	);
}

function Contact() {
	const { t, i18n } = useTranslation();
	const [status, setStatus] = useState<Status>('idle');

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const wantsCV = data.get('sendCV') === 'on';
		const payload = {
			name: String(data.get('name') ?? '').trim(),
			email: String(data.get('email') ?? '').trim(),
			reason: String(data.get('reason') ?? '').trim(),
			projectType: String(data.get('projectType') ?? '').trim(),
			message: String(data.get('message') ?? '').trim(),
			company: String(data.get('company') ?? '').trim(), // honeypot
			// Idioma en que se está navegando: define en qué idioma le llega el
			// acuse automático a quien escribe.
			locale: i18n.language,
		};

		setStatus('sending');
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (res.ok) {
				setStatus('success');
				form.reset();
				if (wantsCV) {
					window.open('/docs/Nahuel-Wagner-CV.pdf', '_blank', 'noopener');
				}
			} else {
				setStatus('error');
			}
		} catch {
			setStatus('error');
		}
	};

	const inputClass =
		'w-full px-4 py-3 rounded-lg bg-bg/50 border border-outline text-content placeholder-content-muted/60 focus:outline-hidden focus:border-primary focus:bg-bg/70 transition-colors';
	const labelClass = 'block text-xs font-space font-medium text-content-muted mb-1.5';

	return (
		<section id="contact" className="py-20 scroll-mt-20">
			<m.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2, once: true }}
				transition={{ duration: 0.6 }}
				className="mb-12"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('contact.eyebrow')}
				</p>
				<h2 className="text-3xl md:text-4xl font-space font-bold text-content mb-3">
					{t('contact.title')}
				</h2>
				<p className="text-content-muted max-w-xl">{t('contact.subtitle')}</p>
			</m.div>

			<div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8 md:gap-12">
				{/* Info panel */}
				<m.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ amount: 0.2, once: true }}
					transition={{ duration: 0.6 }}
					className="space-y-3"
				>
					<Method
						icon={FiMail}
						label={t('contact.methods.email')}
						value={EMAIL}
						href={`mailto:${EMAIL}`}
					/>
					<Method
						icon={FiMapPin}
						label={t('contact.methods.basedIn')}
						value={t('contact.methods.basedValue')}
					/>
					<Method
						icon={FiGithub}
						label={t('contact.methods.github')}
						value="@Nahuelito97"
						href="https://github.com/Nahuelito97"
					/>
					<Method
						icon={FiLinkedin}
						label={t('contact.methods.linkedin')}
						value="@nahuewagner"
						href="https://www.linkedin.com/in/nahuewagner/"
					/>
					<div className="mt-4 flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-3">
						<span className="relative inline-flex w-2 h-2">
							<span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
							<span className="relative w-2 h-2 rounded-full bg-success" />
						</span>
						<span className="text-xs font-space text-success">{t('contact.openBadge')}</span>
					</div>

					{CALENDLY_URL && (
						<a
							href={CALENDLY_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-4 py-3 text-sm font-space text-primary hover:bg-primary hover:text-on-accent hover:border-primary transition-colors"
						>
							<FiCalendar className="w-4 h-4" />
							{t('contact.bookCall')}
						</a>
					)}

					{WHATSAPP_URL && (
						<a
							href={WHATSAPP_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 rounded-lg border border-success/40 bg-success/5 px-4 py-3 text-sm font-space text-success hover:bg-success hover:text-on-accent hover:border-success transition-colors"
						>
							<FaWhatsapp className="w-4 h-4" />
							{t('contact.whatsapp')}
						</a>
					)}
				</m.div>

				{/* Form */}
				<m.form
					onSubmit={handleSubmit}
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ amount: 0.2, once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="space-y-4"
				>
					{/* Honeypot — humans don't see this; bots fill it and get silently dropped */}
					<input
						type="text"
						name="company"
						tabIndex={-1}
						autoComplete="off"
						aria-hidden="true"
						className="absolute left-[-9999px] top-auto h-0 w-0 opacity-0 pointer-events-none"
						defaultValue=""
					/>

					<div className="grid sm:grid-cols-2 gap-4">
						<div>
							<label htmlFor="contact-name" className={labelClass}>
								{t('contact.form.name')}
							</label>
							<input
								id="contact-name"
								type="text"
								name="name"
								required
								placeholder={t('contact.form.namePlaceholder')}
								className={inputClass}
							/>
						</div>
						<div>
							<label htmlFor="contact-email" className={labelClass}>
								{t('contact.form.email')}
							</label>
							<input
								id="contact-email"
								type="email"
								name="email"
								required
								placeholder={t('contact.form.emailPlaceholder')}
								className={inputClass}
							/>
						</div>
					</div>
					<div className="grid sm:grid-cols-2 gap-4">
						<div>
							<label htmlFor="contact-reason" className={labelClass}>
								{t('contact.form.reason')}
							</label>
							<select
								id="contact-reason"
								name="reason"
								defaultValue=""
								className={`${inputClass} appearance-none pr-9 bg-no-repeat bg-size-[14px_14px] bg-position-[right_12px_center]`}
								style={{
									backgroundImage:
										"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23b9b3d6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
								}}
							>
								<option value="">{t('contact.form.selectPlaceholder')}</option>
								{REASON_KEYS.map((k) => (
									<option key={k} value={REASON_VALUES[k]}>
										{t(`contact.form.reasonOptions.${k}`)}
									</option>
								))}
							</select>
						</div>
						<div>
							<label htmlFor="contact-projectType" className={labelClass}>
								{t('contact.form.projectType')}
							</label>
							<select
								id="contact-projectType"
								name="projectType"
								defaultValue=""
								className={`${inputClass} appearance-none pr-9 bg-no-repeat bg-size-[14px_14px] bg-position-[right_12px_center]`}
								style={{
									backgroundImage:
										"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23b9b3d6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
								}}
							>
								<option value="">{t('contact.form.selectPlaceholder')}</option>
								{PROJECT_TYPE_KEYS.map((k) => (
									<option key={k} value={PROJECT_TYPE_VALUES[k]}>
										{t(`contact.form.projectTypeOptions.${k}`)}
									</option>
								))}
							</select>
						</div>
					</div>
					<div>
						<label htmlFor="contact-message" className={labelClass}>
							{t('contact.form.message')}
						</label>
						<textarea
							id="contact-message"
							name="message"
							required
							rows={6}
							placeholder={t('contact.form.messagePlaceholder')}
							className={`${inputClass} resize-none`}
						/>
					</div>
					<label className="inline-flex items-center gap-2 text-sm text-content-muted cursor-pointer select-none">
						<input
							type="checkbox"
							name="sendCV"
							className="w-4 h-4 rounded-sm border border-outline bg-bg/50 accent-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
						/>
						{t('contact.form.sendCv')} <span className="opacity-60 font-mono text-xs">(PDF)</span>
					</label>
					<div className="flex items-center gap-4 flex-wrap pt-1">
						<button
							type="submit"
							disabled={status === 'sending'}
							className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-space font-medium bg-primary text-on-accent hover:bg-primary-pressed shadow-lg shadow-primary/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
						>
							{status === 'sending' ? t('contact.form.submitting') : t('contact.form.submit')}
							<FiArrowRight className="w-4 h-4" />
						</button>
						{status === 'success' && (
							<span className="inline-flex items-center gap-1.5 text-sm text-success font-space">
								<FiCheckCircle className="w-4 h-4" />
								{t('contact.form.success')}
							</span>
						)}
						{status === 'error' && (
							<span className="inline-flex items-center gap-1.5 text-sm text-danger font-space">
								<FiAlertCircle className="w-4 h-4" />
								{t('contact.form.error', { email: EMAIL })}
							</span>
						)}
					</div>
				</m.form>
			</div>
		</section>
	);
}

export default Contact;
