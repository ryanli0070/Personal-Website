import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EASE } from './easing.js';

const MotionNav = motion.nav;
const MotionSpan = motion.span;

const navLinks = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <MotionNav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40"
    >
      <div className="px-8 sm:px-12 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-lg text-white tracking-wide transition-opacity duration-300 hover:opacity-60"
        >
          Ryan Li
        </Link>
        <div className="flex items-center gap-6 sm:gap-10">
          {navLinks.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative py-1 text-[0.7rem] sm:text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                  active ? 'text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                {label}
                {active && (
                  <MotionSpan
                    layoutId="nav-underline"
                    className="absolute inset-x-0 bottom-0 h-px bg-white"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </MotionNav>
  );
}
