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
      className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors shrink-0 mt-1"
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

function ProjectCard({ title, description, stack, url }) {
  const Tag = url ? 'a' : 'div';
  const linkProps = url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Tag
      {...linkProps}
      className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between mb-4">
        <h2 className="font-serif text-2xl text-white">{title}</h2>
        {url && <ArrowIcon />}
      </div>
      <p className="text-neutral-400 leading-relaxed mb-6">{description}</p>
      <div className="flex flex-wrap gap-2">
        {stack.map((tech) => (
          <span
            key={tech}
            className="text-xs tracking-wide text-neutral-500 border border-white/10 rounded-full px-3 py-1"
          >
            {tech}
          </span>
        ))}
      </div>
    </Tag>
  );
}

export default function Projects() {
  return (
    <section className="min-h-screen px-6 py-28">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl text-white mb-12">
          Projects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
