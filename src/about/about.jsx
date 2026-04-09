import aboutpic from '../images/aboutpic.webp';

export default function About() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-28">
      <div className="max-w-4xl w-full rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-sm p-8 sm:p-12">
        <h1 className="font-serif text-4xl sm:text-5xl text-white mb-10">
          About Me
        </h1>
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-5">
            <p className="text-neutral-300 text-lg leading-relaxed">
              Hi! My name is Ryan, and I&apos;m a first year student at the
              University of Waterloo studying Systems Design Engineering.
            </p>
            <p className="text-neutral-300 text-lg leading-relaxed">
              I&apos;m in my co-op term, currently seeking a fall 2026 internship.
              I&apos;m excited to learn more about fullstack development.
            </p>
            <p className="text-neutral-400 text-base leading-relaxed">
              In my free time, I enjoy playing basketball &amp; volleyball, going
              to the gym, and cooking new recipes. Feel free to reach out&mdash;I
              would love to chat!
            </p>
          </div>
          <div className="shrink-0">
            <img
              src={aboutpic}
              alt="Picture of Ryan"
              className="w-56 sm:w-72 rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
