import type { ReactNode } from 'react';

export function Field({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div>
			<h4 className="text-xs font-space font-semibold text-content-muted uppercase tracking-wider mb-2">
				{label}
			</h4>
			{children}
		</div>
	);
}

export function Bullets({ items }: { items: string[] }) {
	return (
		<ul className="space-y-2">
			{items.map((item) => (
				<li key={item} className="flex gap-2 text-sm text-content-muted leading-relaxed">
					<span className="text-primary mt-1.5 shrink-0">
						<svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
							<circle cx="4" cy="4" r="3" />
						</svg>
					</span>
					{item}
				</li>
			))}
		</ul>
	);
}
