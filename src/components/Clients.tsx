import { useTranslation } from 'react-i18next';

interface Client {
	name: string;
	src?: string;
}

const clients: Client[] = [
	{ name: 'EIMO', src: '/assets/projects/eimo-logo.png' },
	{ name: 'TUTU', src: '/assets/projects/tutu-logo.webp' },
	{ name: 'GearthLogic', src: '/assets/projects/gearth.webp' },
	{ name: 'JennyGas', src: '/assets/projects/jennygas-logo.webp' },
	{ name: 'Tribu Saludable', src: '/assets/projects/tribu-logo.webp' },
	{ name: 'Power Staffing', src: '/assets/projects/powerstaffing-logo.svg' },
	{ name: 'Correo Argentino' },
	{ name: 'Adsmovil' },
];

function LogoChip({ client }: { client: Client }) {
	return (
		<div className="flex items-center gap-2 shrink-0 mx-8 opacity-70 hover:opacity-100 transition-opacity">
			{client.src ? (
				<img
					src={client.src}
					alt={client.name}
					loading="lazy"
					decoding="async"
					width={36}
					height={36}
					className="h-9 w-9 object-contain"
				/>
			) : (
				<span
					aria-hidden
					className="grid place-items-center h-9 w-9 rounded-md bg-bg/60 border border-outline font-space font-semibold text-content-muted text-sm"
				>
					{client.name.charAt(0)}
				</span>
			)}
			<span className="text-sm font-space font-medium text-content-muted whitespace-nowrap">
				{client.name}
			</span>
		</div>
	);
}

function Clients() {
	const { t } = useTranslation();
	// Duplicate the list so the -50% transform produces a seamless loop.
	const loop = [...clients, ...clients];

	return (
		<section aria-label={t('clients.eyebrow')} className="py-12 border-y border-outline/30">
			<div className="text-center mb-6">
				<p className="text-xs font-mono text-content-muted uppercase tracking-widest mb-1.5">
					{t('clients.eyebrow')}
				</p>
				<p className="text-sm text-content-muted/70">
					{t('clients.subtitle', { count: clients.length })}
				</p>
			</div>

			<div className="marquee-mask overflow-hidden">
				<ul className="marquee-track flex w-max items-center py-2">
					{loop.map((c, i) => (
						<li key={`${c.name}-${i}`} aria-hidden={i >= clients.length}>
							<LogoChip client={c} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default Clients;
