import { useEffect, useRef, useState } from 'react';
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
    title: 'Scout',
    description:
      'A lidar-equipped rover that scans buildings and checks clearances to assess accessibility.',
    award: '2nd Place · TigerData Track · Hack the North 2026',
    stack: ['React', 'TypeScript', 'Python', 'TimescaleDB'],
    url: 'https://devpost.com/software/scoutable',
    media: [
      { type: 'video', src: '/scout-demo.mp4', ratio: '9 / 16' },
      { type: 'image', src: '/scout-rover.jpg', ratio: '3 / 4', alt: 'The Scout rover with its lidar sensor' },
    ],
  },
  {
    title: 'Folio',
    description:
      'A centralized project sharing platform that puts all your GitHub, Devpost and demo links in one place.',
    stack: ['Next.js', 'TypeScript', 'Postgres', 'Drizzle'],
    url: 'https://folio-share.vercel.app',
    media: [
      { type: 'image', src: '/folio.jpg', ratio: '1600 / 912', alt: 'A Folio profile page with pinned projects' },
    ],
  },
  {
    title: 'Eura',
    description:
      'An AI tutor whiteboard app that verifies handwritten math and guides students with hints to solutions.',
    stack: ['React', 'Python', 'Postgres', 'AWS'],
    url: 'https://apps.apple.com/ca/app/eura-learn/id6780240119',
    media: [{ type: 'video', src: '/eura-demo.mp4' }],
  },
  {
    title: 'Shogun Showdown',
    description:
      'A local 2D multiplayer platform fighting game inspired by Super Smash Bros.',
    stack: ['MonoGame', '.NET', 'C#'],
    url: 'https://github.com/ryanli0070/Shogun-Showdown',
    media: [
      { type: 'video', src: '/shogun-demo.mp4', poster: '/shogun-poster.jpg', ratio: '1504 / 852' },
    ],
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
    media: [
      { type: 'image', src: '/twovie.jpg', ratio: '548 / 678', alt: 'The Twovie app menu' },
    ],
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

// an expanded demo keeps decoding while scrolled out of view, so play
// only what's on screen
function useVisiblePlayback() {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function DemoVideo(props) {
  const ref = useVisiblePlayback();
  return <video ref={ref} {...props} />;
}

function MediaItem({ type, src, poster, alt, ratio = '16 / 9', single }) {
  const [w, h] = ratio.split('/').map(Number);
  const portrait = w < h;
  const sizing = portrait
    ? 'h-[26rem] sm:h-[32rem] max-h-[70vh] max-w-full'
    : single
      ? 'w-full max-w-3xl'
      : 'w-full sm:w-auto sm:h-[24rem] max-w-full';
  const className = `${sizing} rounded-xl border border-white/10 object-cover shadow-2xl shadow-black/40`;
  const style = { aspectRatio: ratio };

  if (type === 'video') {
    return (
      <DemoVideo
        src={src}
        poster={poster}
        controls
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={style}
        className={className}
      />
    );
  }
  return <img src={src} alt={alt} loading="lazy" style={style} className={className} />;
}

function ProjectRow({ index, title, description, award, stack, url, media }) {
  const Tag = url ? motion.a : motion.div;
  const linkProps = url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const [showDemo, setShowDemo] = useState(false);
  const hasVideo = media?.some((m) => m.type === 'video');

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
          {award && (
            <p className="mt-2 font-serif italic text-sm text-amber-200/80">{award}</p>
          )}
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

      {media?.length > 0 && (
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
            {showDemo
              ? hasVideo ? 'Hide demo' : 'Hide preview'
              : hasVideo ? 'Watch demo' : 'View preview'}
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
                <div className="mt-5 flex flex-wrap items-start gap-4">
                  {media.map((item) => (
                    <MediaItem key={item.src} {...item} single={media.length === 1} />
                  ))}
                </div>
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
