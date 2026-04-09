import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/[0.08]">
      <div className="px-8 sm:px-12 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-lg text-white tracking-wide hover:opacity-80 transition-opacity"
        >
          Ryan Li
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-xs sm:text-sm tracking-wide transition-colors duration-300 ${
                pathname === to
                  ? 'text-white'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
