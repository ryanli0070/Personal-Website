import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

export default function Home() {
  const played = hasPlayed;

  useEffect(() => {
    hasPlayed = true;
  }, []);

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
          <MotionSpan
            key={i}
            aria-hidden="true"
            variants={letterVariants}
            className="inline-block"
          >
            {char === ' ' ? ' ' : char}
          </MotionSpan>
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
