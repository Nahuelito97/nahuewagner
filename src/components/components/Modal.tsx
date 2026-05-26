import { Dialog, DialogPanel } from '@headlessui/react';
import type { ReactNode } from 'react';

const SIZES = {
	md: 'max-w-2xl',
	lg: 'max-w-4xl',
	xl: 'max-w-5xl',
} as const;

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	size?: keyof typeof SIZES;
}

/** Reusable modal shell: backdrop + animated, scrollable panel with the page's grid backdrop. */
function Modal({ open, onClose, children, size = 'md' }: ModalProps) {
	return (
		<Dialog open={open} onClose={onClose} className="relative z-[70]">
			<div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel
					transition
					className={`relative w-full ${SIZES[size]} max-h-[90vh] overflow-y-auto rounded-2xl border border-outline bg-surface shadow-2xl shadow-black/50 transition duration-200 ease-out data-[closed]:opacity-0 data-[closed]:scale-95`}
				>
					{/* Decorative grid + glow inside the panel, matching the page layout */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
					>
						{/* Full-coverage grid (no mask) so lines are visible across the whole modal */}
					<div
						className="absolute inset-0 opacity-60"
						style={{
							backgroundImage:
								'linear-gradient(to right, rgba(87, 79, 134, 0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(87, 79, 134, 0.28) 1px, transparent 1px)',
							backgroundSize: '44px 44px',
						}}
					/>
						<div className="absolute -top-24 -right-12 h-64 w-64 rounded-full bg-primary/10 blur-[90px]" />
						<div className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-secondary/10 blur-[90px]" />
					</div>
					<div className="relative">{children}</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
}

export default Modal;
