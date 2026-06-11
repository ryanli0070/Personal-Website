import {
  motion,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import aboutpic from '../images/aboutpic.webp';
import { Reveal, Kicker } from '../components/motion.jsx';

const MotionDiv = motion.div;

const TILT_SPRING = { stiffness: 150, damping: 18 };

function TiltPortrait() {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);
  const glareX = useSpring(50, TILT_SPRING);
  const glareY = useSpring(50, TILT_SPRING);
  const glare = useMotionTemplate`radial-gradient(240px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.16), transparent 70%)`;

  const handleMove = (e) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 14);
    glareX.set((px + 0.5) * 100);
    glareY.set((py + 0.5) * 100);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <div className="group relative" style={{ perspective: 800 }}>
      <div className="absolute -inset-4 rounded-3xl bg-white/[0.07] blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <MotionDiv
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY }}
        className="relative overflow-hidden rounded-2xl ring-1 ring-white/15"
      >
        <img
          src={aboutpic}
          alt="Picture of Ryan"
          className="w-56 sm:w-72 object-cover"
        />
        <MotionDiv
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </MotionDiv>
    </div>
  );
}

export default function About() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20">
      <div className="max-w-4xl w-full">
        <Kicker index="01" delay={0.05}>
          About
        </Kicker>

        <Reveal delay={0.15}>
          <h1 className="font-serif text-5xl sm:text-6xl text-white mt-6 mb-14">
            About <span className="italic font-light text-neutral-300">Me</span>
          </h1>
        </Reveal>

        <div className="flex flex-col-reverse md:flex-row gap-12 md:gap-16 items-center md:items-start">
          <div className="flex-1 space-y-6">
            <Reveal delay={0.25}>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-neutral-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Seeking Fall 2026 internships
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="text-neutral-200 text-lg sm:text-xl leading-relaxed">
                Hi! My name is Ryan, and I&apos;m a first year student at the
                University of Waterloo studying Systems Design Engineering.
              </p>
            </Reveal>

            <Reveal delay={0.45}>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                I&apos;m in my co-op term, currently seeking a fall 2026
                internship. I&apos;m excited to learn more about fullstack
                development.
              </p>
            </Reveal>

            <Reveal delay={0.55}>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                In my free time, I enjoy playing basketball &amp; volleyball,
                going to the gym, and cooking new recipes. Feel free to reach
                out&mdash;I would love to chat!
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.3} className="shrink-0">
            <TiltPortrait />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
