import { Reveal, Kicker, Magnetic } from '../components/motion.jsx';

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ryan-li007/',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/ryanli0070',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

function ExternalArrow() {
  return (
    <svg
      className="w-3.5 h-3.5 text-neutral-600 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
      />
    </svg>
  );
}

export default function Contact() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-28">
      <div className="max-w-xl w-full flex flex-col items-center text-center">
        <Kicker index="03" delay={0.05}>
          Contact
        </Kicker>

        <Reveal delay={0.15}>
          <h1 className="font-serif text-5xl sm:text-6xl text-white mt-6">
            Let&apos;s{' '}
            <span className="italic font-light text-neutral-300">Connect</span>
          </h1>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-6 text-neutral-400 leading-relaxed">
            Always open to new opportunities and interesting conversations.
          </p>
        </Reveal>

        <Reveal delay={0.4} className="mt-12">
          <Magnetic strength={0.15}>
            <a
              href="mailto:r584li@uwaterloo.ca"
              className="group relative inline-block font-serif text-2xl sm:text-3xl text-white"
            >
              r584li@uwaterloo.ca
              <span className="absolute -bottom-2 left-0 h-px w-full bg-white/20" />
              <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </a>
          </Magnetic>
        </Reveal>

        <div className="mt-16 flex items-center gap-4">
          {socials.map(({ label, href, icon }, i) => (
            <Reveal key={label} delay={0.55 + i * 0.1}>
              <Magnetic strength={0.35}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-neutral-300 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                >
                  <span className="text-neutral-500 transition-colors duration-300 group-hover:text-white">
                    {icon}
                  </span>
                  {label}
                  <ExternalArrow />
                </a>
              </Magnetic>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
