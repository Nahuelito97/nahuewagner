import { useMemo } from 'react';
import { motion, useReducedMotion, type MotionProps } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiClock, FiGlobe, FiZap } from 'react-icons/fi';
import SocialLinks from './components/SocialLinks';
import MagneticButton from './components/MagneticButton';
import { useTypewriter } from '../hooks/useTypewriter';

const fadeUp = (delay = 0): MotionProps => ({
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const codeLines: { text: string; cls?: string }[][] = [
	[
		{ text: 'const ', cls: 'text-secondary' },
		{ text: 'nahuel', cls: 'text-content' },
		{ text: ': ', cls: 'text-content-muted' },
		{ text: 'Engineer', cls: 'text-syncing' },
		{ text: ' = {', cls: 'text-content-muted' },
	],
	[
		{ text: '  role', cls: 'text-primary' },
		{ text: ': ', cls: 'text-content-muted' },
		{ text: "'Backend / Full-Stack'", cls: 'text-success' },
		{ text: ',', cls: 'text-content-muted' },
	],
	[
		{ text: '  based', cls: 'text-primary' },
		{ text: ': ', cls: 'text-content-muted' },
		{ text: "'Posadas, AR'", cls: 'text-success' },
		{ text: ',', cls: 'text-content-muted' },
	],
	[
		{ text: '  years', cls: 'text-primary' },
		{ text: ': ', cls: 'text-content-muted' },
		{ text: '5', cls: 'text-warn' },
		{ text: ',', cls: 'text-content-muted' },
	],
	[
		{ text: '  stack', cls: 'text-primary' },
		{ text: ': [', cls: 'text-content-muted' },
		{ text: "'NestJS'", cls: 'text-success' },
		{ text: ', ', cls: 'text-content-muted' },
		{ text: "'TypeScript'", cls: 'text-success' },
		{ text: ', ', cls: 'text-content-muted' },
		{ text: "'React'", cls: 'text-success' },
		{ text: '],', cls: 'text-content-muted' },
	],
	[
		{ text: '  focus', cls: 'text-primary' },
		{ text: ': [', cls: 'text-content-muted' },
		{ text: "'Clean Arch'", cls: 'text-success' },
		{ text: ', ', cls: 'text-content-muted' },
		{ text: "'DDD'", cls: 'text-success' },
		{ text: ', ', cls: 'text-content-muted' },
		{ text: "'SOLID'", cls: 'text-success' },
		{ text: '],', cls: 'text-content-muted' },
	],
	[
		{ text: '  openToWork', cls: 'text-primary' },
		{ text: ': ', cls: 'text-content-muted' },
		{ text: 'true', cls: 'text-warn' },
		{ text: ',', cls: 'text-content-muted' },
	],
	[{ text: '};', cls: 'text-content-muted' }],
];

function TerminalCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
			className="hidden lg:block"
		>
			<div className="rounded-xl border border-outline bg-surface/60 backdrop-blur shadow-2xl shadow-black/30 overflow-hidden">
				<div className="flex items-center gap-2 px-4 py-3 border-b border-outline bg-bg/40">
					<span className="w-3 h-3 rounded-full bg-danger/80" />
					<span className="w-3 h-3 rounded-full bg-warn/80" />
					<span className="w-3 h-3 rounded-full bg-success/80" />
					<span className="ml-2 text-xs font-mono text-content-muted">nahuel.ts</span>
				</div>
				<pre className="p-5 text-[13px] leading-relaxed font-mono overflow-x-auto">
					<code>
						{codeLines.map((line, i) => (
							<div key={i}>
								{line.map((tok, j) => (
									<span key={j} className={tok.cls ?? 'text-content'}>
										{tok.text}
									</span>
								))}
							</div>
						))}
						<div>
							<span className="inline-block w-2 h-4 align-middle bg-primary animate-pulse-slow" />
						</div>
					</code>
				</pre>
			</div>
		</motion.div>
	);
}

function Hero() {
	const { t } = useTranslation();
	const reduce = useReducedMotion();
	const words = useMemo(
		() => t('hero.buildWords', { returnObjects: true }) as string[],
		[t],
	);
	const typed = useTypewriter(words, { enabled: !reduce });
	const displayed = reduce ? words[0] : typed;

	return (
		<section id="home" className="min-h-screen flex items-center pt-20 pb-12">
			<div className="w-full grid lg:grid-cols-2 gap-12 items-center">
				<div>
					{/* Available badge */}
					<motion.div {...fadeUp(0.1)} className="mb-6">
						<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium font-space bg-success/10 border border-success/20 text-success">
							<span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
							{t('hero.openBadge')}
						</span>
					</motion.div>

					{/* Name */}
					<motion.div {...fadeUp(0.2)}>
						<p className="text-base md:text-lg font-space text-content-muted mb-2">
							{t('hero.hi')}
						</p>
						<div className="relative">
							<div
								aria-hidden
								className="absolute -inset-x-6 -inset-y-2 bg-gradient-to-r from-primary/30 via-secondary/20 to-transparent blur-3xl rounded-full opacity-70 animate-pulse-slow"
							/>
							<h1 className="relative text-5xl md:text-7xl font-space font-bold mb-4 leading-tight">
								<span className="text-content">Nahuel </span>
								<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
									Wagner
								</span>
							</h1>
						</div>
					</motion.div>

					{/* Typewriter */}
					<motion.p
						{...fadeUp(0.28)}
						className="mb-6 font-mono text-sm md:text-base text-content-muted"
					>
						<span className="text-primary">$</span> {t('hero.iBuild')}{' '}
						<span className="text-content">{displayed}</span>
						<span
							aria-hidden
							className="inline-block w-[0.55em] h-[1em] align-[-0.15em] bg-primary animate-pulse ml-0.5"
						/>
					</motion.p>

					{/* Role */}
					<motion.p
						{...fadeUp(0.3)}
						className="text-lg md:text-xl font-space text-content-muted mb-6"
					>
						{t('hero.rolePrefix')}
						<span className="text-primary">WagnerLabs</span>
						{t('hero.founderSuffix')}
					</motion.p>

					{/* Bio */}
					<motion.p
						{...fadeUp(0.4)}
						className="text-base md:text-lg text-content-muted max-w-2xl mb-3 leading-relaxed"
					>
						{t('hero.bioStart')}
						<span className="text-content font-medium">{t('hero.cleanArch')}</span>
						{t('about.p2Middle1')}
						<span className="text-content font-medium">{t('hero.ddd')}</span>
						{t('about.p2Middle2')}
						<span className="text-content font-medium">{t('hero.solid')}</span> {t('hero.principles')}
					</motion.p>
					<motion.p
						{...fadeUp(0.45)}
						className="text-sm text-content-muted mb-8 flex items-center gap-1.5"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
							/>
						</svg>
						{t('hero.location')}
					</motion.p>

					{/* CTAs */}
					<motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-3 mb-10">
						<MagneticButton>
							<a
								href="#work"
								className="px-6 py-3 bg-primary hover:bg-primary-pressed text-on-accent rounded-lg font-space font-medium text-sm transition-colors duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 inline-block"
							>
								{t('hero.viewWork')}
							</a>
						</MagneticButton>
						<MagneticButton>
							<a
								href="#contact"
								className="px-6 py-3 border border-outline hover:border-primary text-content hover:text-primary rounded-lg font-space font-medium text-sm transition-colors duration-200 inline-block"
							>
								{t('hero.getInTouch')}
							</a>
						</MagneticButton>
						<MagneticButton>
							<a
								href="/docs/Nahuel-Wagner-CV.pdf"
								download
								className="px-6 py-3 bg-secondary/15 border border-secondary/40 text-secondary hover:bg-secondary hover:text-on-accent hover:border-secondary rounded-lg font-space font-medium text-sm transition-colors duration-200 inline-flex items-center gap-2"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								{t('hero.downloadCv')}
								<span className="ml-1 text-[10px] font-mono uppercase tracking-wider opacity-70">
									PDF
								</span>
							</a>
						</MagneticButton>
					</motion.div>

					{/* Social links */}
					<motion.div {...fadeUp(0.6)} className="flex justify-start">
						<SocialLinks />
					</motion.div>

					{/* Trust strip */}
					<motion.div
						{...fadeUp(0.7)}
						className="mt-6 pt-6 border-t border-outline/40 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-content-muted"
					>
						<span className="inline-flex items-center gap-1.5">
							<FiClock className="w-3.5 h-3.5 text-success" />
							{t('hero.trust.reply')}
						</span>
						<span className="text-outline/60" aria-hidden>
							·
						</span>
						<span className="inline-flex items-center gap-1.5">
							<FiGlobe className="w-3.5 h-3.5 text-success" />
							{t('hero.trust.tz')}
						</span>
						<span className="text-outline/60" aria-hidden>
							·
						</span>
						<span className="inline-flex items-center gap-1.5">
							<FiZap className="w-3.5 h-3.5 text-success" />
							{t('hero.trust.available')}
						</span>
					</motion.div>
				</div>

				{/* Terminal card */}
				<TerminalCard />
			</div>
		</section>
	);
}

export default Hero;
