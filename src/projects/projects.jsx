import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from 'framer-motion';
import { Reveal, Kicker } from '../components/motion.jsx';

const MotionDiv = motion.div;

const projects = [
  {
    title: 'Eura',
    description:
      'An AI tutor whiteboard app that verifies handwritten math and guides students with hints to solutions.',
    stack: ['React', 'Python', 'Postgres', 'AWS'],
    url: 'https://github.com/ryanli0070/EuraAI',
    demo: '/eura-demo.mp4',
  },
  {
    title: 'Shogun Showdown',
    description:
      'A local 2D multiplayer platform fighting game inspired by Super Smash Bros.',
    stack: ['MonoGame', '.NET', 'C#'],
    url: 'https://github.com/ryanli0070/Shogun-Showdown',
  },
  {
    title: 'MacroBud',
    description: 'A streamlined macro-nutrient tracker using AI parsing.',
    stack: ['React.js', 'FastAPI', 'SQLite'],
    url: 'https://github.com/ryanli0070/MacroBud',
  },
  {
    title: 'Twovie',
    description:
      'A movie search tool that helps users discover films based on preferences.',
    stack: ['Python', 'HTML'],
    url: 'https://github.com/ThomasZhang223/Jamhacks-7',
  },
];

function ArrowIcon() {
  return (
    <svg
      className="w-5 h-5 text-neutral-600 transition-all duration-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
      />
    </svg>
  );
}

function ProjectRow({ index, title, description, stack, url, demo }) {
  const Tag = url ? motion.a : motion.div;
  const linkProps = url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const [showDemo, setShowDemo] = useState(false);

  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX}px ${spotY}px, rgba(255,255,255,0.06), transparent 70%)`;

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  return (
    <div
      onMouseMove={handleMove}
      className="group relative py-10 transition-all duration-500 hover:pl-3"
    >
      <MotionDiv
        style={{ background: spotlight }}
        className="pointer-events-none absolute -inset-x-6 inset-y-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <Tag
        {...linkProps}
        className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 sm:gap-x-6"
      >
        <span className="font-serif italic text-sm text-neutral-600 transition-colors duration-500 group-hover:text-neutral-400">
          {String(index).padStart(2, '0')}
        </span>

        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white">{title}</h2>
          <p className="mt-3 max-w-xl text-neutral-400 leading-relaxed transition-colors duration-500 group-hover:text-neutral-300">
            {description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] tracking-[0.2em] uppercase text-neutral-500">
            {stack.map((tech, i) => (
              <span key={tech} className="flex items-center gap-3">
                {i > 0 && <span className="h-0.5 w-0.5 rounded-full bg-neutral-700" />}
                {tech}
              </span>
            ))}
          </div>
        </div>

        <span className="self-start mt-2">{url && <ArrowIcon />}</span>
      </Tag>

      {demo && (
        <div className="mt-6 pl-16 sm:pl-[4.5rem]">
          <button
            type="button"
            onClick={() => setShowDemo((v) => !v)}
            aria-expanded={showDemo}
            className="group/demo inline-flex items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-neutral-500 transition-colors duration-300 hover:text-white"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                showDemo ? 'rotate-90' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            {showDemo ? 'Hide demo' : 'Watch demo'}
          </button>

          <AnimatePresence initial={false}>
            {showDemo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <video
                  src={demo}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="mt-5 w-full max-w-3xl rounded-xl border border-white/10 shadow-2xl shadow-black/40"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <section className="min-h-screen px-6 pt-32 pb-24">
      <div className="max-w-4xl mx-auto">
        <Kicker index="02" delay={0.05}>
          Projects
        </Kicker>

        <Reveal delay={0.15}>
          <h1 className="font-serif text-5xl sm:text-6xl text-white mt-6 mb-14">
            Selected{' '}
            <span className="italic font-light text-neutral-300">Work</span>
          </h1>
        </Reveal>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {projects.map((project, i) => (
            <ProjectRow key={project.title} index={i + 1} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
