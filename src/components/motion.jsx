import { motion } from 'framer-motion';
import { EASE } from './easing.js';

const MotionDiv = motion.div;

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
