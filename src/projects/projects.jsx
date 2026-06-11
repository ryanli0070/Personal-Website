import { motion } from 'framer-motion';
import { EASE } from '../components/easing.js';
import { Reveal, Kicker } from '../components/motion.jsx';

const projects = [
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
    stack: ['React.js', 'Node.js', 'MySQL'],
    url: null,
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

function ProjectRow({ index, title, description, stack, url, delay }) {
  const Tag = url ? motion.a : motion.div;
  const linkProps = url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Tag
      {...linkProps}
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 sm:gap-x-6 py-10 transition-all duration-500 hover:pl-3"
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
            <ProjectRow
              key={project.title}
              index={i + 1}
              delay={0.3 + i * 0.12}
              {...project}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
