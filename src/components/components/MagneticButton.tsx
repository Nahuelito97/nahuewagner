import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';

interface MagneticButtonProps {
	children: ReactNode;
	className?: string;
	/** How strongly the wrapper follows the cursor (0–1). */
	strength?: number;
}

/**
 * Wraps any element so that, on pointer hover, it gently follows the cursor.
 * No-op when the user prefers reduced motion or on touch (mousemove never fires).
 */
function MagneticButton({ children, className, strength = 0.25 }: MagneticButtonProps) {
	const reduce = useReducedMotion();
	const ref = useRef<HTMLSpanElement>(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.3 });
	const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.3 });

	const handleMove = (e: ReactMouseEvent<HTMLSpanElement>) => {
		if (reduce) return;
		const el = ref.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		x.set((e.clientX - (r.left + r.width / 2)) * strength);
		y.set((e.clientY - (r.top + r.height / 2)) * strength);
	};
	const handleLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<motion.span
			ref={ref}
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
			style={{ x: sx, y: sy }}
			className={`inline-block ${className ?? ''}`}
		>
			{children}
		</motion.span>
	);
}

export default MagneticButton;
