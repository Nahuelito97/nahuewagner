import { useEffect, useRef, useState } from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface StatItem {
	id: 'years' | 'projects' | 'companies' | 'remote';
	to: number;
	suffix: string;
}

const STATS: StatItem[] = [
	{ id: 'years', to: 5, suffix: '+' },
	{ id: 'projects', to: 15, suffix: '+' },
	{ id: 'companies', to: 4, suffix: '+' },
	{ id: 'remote', to: 100, suffix: '%' },
];

function CountUp({ to, suffix = '', duration = 1.2 }: { to: number; suffix?: string; duration?: number }) {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true, amount: 0.2 });
	const reduce = useReducedMotion();
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (!inView) return;
		if (reduce) {
			setValue(to);
			return;
		}
		let raf = 0;
		const start = performance.now();
		const tick = (now: number) => {
			const p = Math.min((now - start) / (duration * 1000), 1);
			const eased = 1 - Math.pow(1 - p, 3);
			setValue(Math.round(eased * to));
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [inView, reduce, to, duration]);

	return (
		<span ref={ref}>
			{value}
			{suffix}
		</span>
	);
}

function About() {
	const { t } = useTranslation();
	return (
		<section id="about" className="py-20 scroll-mt-20">
			<m.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ amount: 0.2 }}
				transition={{ duration: 0.6 }}
				className="mb-12"
			>
				<p className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
					{t('about.eyebrow')}
				</p>
				<h2 className="text-3xl md:text-4xl font-space font-bold text-content mb-3">
					{t('about.title')}
				</h2>
			</m.div>

			<div className="grid md:grid-cols-[240px_1fr] gap-8 md:gap-12 items-start">
				{/* Photo */}
				<m.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ amount: 0.2 }}
					transition={{ duration: 0.6 }}
					className="relative mx-auto md:mx-0 w-52 md:w-full"
				>
					<div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-60 blur-sm" />
					{/* TODO: drop a real headshot at public/assets/portrait.jpg and swap this
					    placeholder for: <img src="/assets/portrait.jpg" alt="Nahuel Wagner" ... /> */}
					<div className="relative w-full aspect-square rounded-2xl border border-outline bg-gradient-to-br from-surface-variant via-surface to-bg flex items-center justify-center overflow-hidden">
						<span className="font-space font-bold text-7xl bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
							NW
						</span>
					</div>
				</m.div>

				{/* Text + stats */}
				<m.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ amount: 0.2 }}
					transition={{ duration: 0.6, delay: 0.15 }}
					className="space-y-4"
				>
					<p className="text-content-muted leading-relaxed">{t('about.p1')}</p>
					<p className="text-content-muted leading-relaxed">
						{t('about.p2Start')}
						<span className="text-content font-medium">{t('hero.cleanArch')}</span>
						{t('about.p2Middle1')}
						<span className="text-content font-medium">{t('hero.ddd')}</span>
						{t('about.p2Middle2')}
						<span className="text-content font-medium">{t('hero.solid')}</span>
						{t('about.p2End')}
						<span className="text-primary">WagnerLabs</span>
						{t('about.p2EndFinal')}
					</p>

					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
						{STATS.map((s) => (
							<div
								key={s.id}
								className="rounded-xl bg-surface border border-outline p-4 text-center transition-colors hover:border-primary/40"
							>
								<div className="text-2xl font-space font-bold text-primary">
									<CountUp to={s.to} suffix={s.suffix} />
								</div>
								<div className="text-xs text-content-muted mt-1">
									{t(`about.stats.${s.id}`)}
								</div>
							</div>
						))}
					</div>
				</m.div>
			</div>
		</section>
	);
}

export default About;
