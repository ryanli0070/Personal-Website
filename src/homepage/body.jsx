import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

let hasTyped = false;

export default function Home() {
  const fullText = 'RYAN LI';
  const [displayText, setDisplayText] = useState(hasTyped ? fullText : '');

  useEffect(() => {
    if (hasTyped) return;
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        hasTyped = true;
      }
    }, 180);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="font-serif text-7xl sm:text-8xl lg:text-9xl font-semibold text-white tracking-tight text-center relative">
        {displayText}
        <span className="animate-blink text-neutral-400 font-light absolute">|</span>
      </h1>

      <div className="mt-6 text-center space-y-1">
        <p className="text-lg sm:text-xl text-neutral-400">
          Systems Design Engineering
        </p>
        <p className="text-base sm:text-lg text-neutral-500">
          University of Waterloo
        </p>
      </div>

      <div className="mt-14 flex items-center gap-6 text-sm tracking-widest uppercase text-neutral-500">
        <Link to="/about" className="hover:text-white transition-colors duration-300">
          About
        </Link>
        <span className="text-neutral-700">·</span>
        <Link to="/projects" className="hover:text-white transition-colors duration-300">
          Projects
        </Link>
        <span className="text-neutral-700">·</span>
        <Link to="/contact" className="hover:text-white transition-colors duration-300">
          Contact
        </Link>
      </div>
    </section>
  );
}
