import { useRef } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';
import { EASE } from './easing.js';

const MotionDiv = motion.div;

const MAGNET_SPRING = { stiffness: 180, damping: 14, mass: 0.4 };

export function Reveal({ children, delay = 0, className }) {
  return (
    <MotionDiv
      className={className}
      initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </MotionDiv>
  );
}

export function Kicker({ index, children, delay = 0, className = '' }) {
  return (
    <Reveal delay={delay}>
      <div
        className={`flex items-center gap-4 text-[0.7rem] tracking-[0.35em] uppercase text-neutral-500 ${className}`}
      >
        <span className="font-serif italic normal-case tracking-normal text-sm text-neutral-600">
          {index}
        </span>
        <span className="h-px w-12 bg-gradient-to-r from-white/30 to-transparent" />
        <span>{children}</span>
      </div>
    </Reveal>
  );
}

export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, MAGNET_SPRING);
  const y = useSpring(0, MAGNET_SPRING);

  const handleMove = (e) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionDiv
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`inline-block ${className}`}
    >
      {children}
    </MotionDiv>
  );
}
