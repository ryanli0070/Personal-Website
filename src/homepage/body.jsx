import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { EASE } from '../components/easing.js';

const MotionH1 = motion.h1;
const MotionSpan = motion.span;
const MotionDiv = motion.div;

let hasPlayed = false;

const NAME = 'RYAN LI';

const letterVariants = {
  hidden: { opacity: 0, y: '0.35em', filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE },
  },
};

const quickLinks = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

function MagneticLetter({ char, mouseX, mouseY }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 120, damping: 14, mass: 0.5 });
  const y = useSpring(0, { stiffness: 120, damping: 14, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    const RADIUS = 160;
    const PUSH = 26;

    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = mouseX.get() - (rect.left + rect.width / 2);
      const dy = mouseY.get() - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist > 0 && dist < RADIUS) {
        const force = ((RADIUS - dist) / RADIUS) * PUSH;
        x.set((-dx / dist) * force);
        y.set((-dy / dist) * force);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const unsubX = mouseX.on('change', update);
    const unsubY = mouseY.on('change', update);
    return () => {
      unsubX();
      unsubY();
    };
  }, [reduce, mouseX, mouseY, x, y]);

  return (
    <MotionSpan
      ref={ref}
      aria-hidden="true"
      variants={letterVariants}
      className="inline-block"
    >
      <MotionSpan style={{ x, y }} className="inline-block">
        {char}
      </MotionSpan>
    </MotionSpan>
  );
}

export default function Home() {
  const played = hasPlayed;
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  useEffect(() => {
    hasPlayed = true;
    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6">
      <MotionH1
        aria-label={NAME}
        initial={played ? false : 'hidden'}
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
        }}
        className="font-serif text-7xl sm:text-8xl lg:text-9xl font-semibold text-white tracking-tight text-center"
      >
        {NAME.split('').map((char, i) => (
          <MagneticLetter
            key={i}
            char={char === ' ' ? ' ' : char}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </MotionH1>

      <MotionDiv
        initial={played ? false : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: played ? 0 : 1 }}
        className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />

      <MotionDiv
        initial={played ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: EASE, delay: played ? 0 : 1.15 }}
        className="mt-8 text-center space-y-1.5"
      >
        <p className="text-lg sm:text-xl text-neutral-300 tracking-wide">
          Systems Design Engineering
        </p>
        <p className="text-sm sm:text-base text-neutral-500 tracking-[0.2em] uppercase">
          University of Waterloo
        </p>
      </MotionDiv>

      <MotionDiv
        initial={played ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: played ? 0 : 1.45 }}
        className="mt-16 flex items-center gap-7 text-xs tracking-[0.25em] uppercase text-neutral-500"
      >
        {quickLinks.map(({ to, label }, i) => (
          <span key={to} className="flex items-center gap-7">
            {i > 0 && <span className="h-1 w-1 rounded-full bg-neutral-700" />}
            <Link
              to={to}
              className="group relative py-1 transition-colors duration-300 hover:text-white"
            >
              {label}
              <span className="absolute left-0 bottom-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-400 ease-out group-hover:scale-x-100" />
            </Link>
          </span>
        ))}
      </MotionDiv>
    </section>
  );
}
