import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Particles from './homepage/particles.jsx';
import Nav from './components/nav.jsx';
import Home from './homepage/body.jsx';
import About from './about/about.jsx';
import Contact from './contact/contact.jsx';
import Projects from './projects/projects.jsx';
import { EASE } from './components/easing.js';

const PageTransition = motion.div;

export default function App() {
  const location = useLocation();

  useEffect(() => {
    document.getElementById('root')?.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 z-0">
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={1000}
            particleSpread={10}
            speed={0.02}
            particleBaseSize={75}
            moveParticlesOnHover={true}
            particleHoverFactor={0.5}
            alphaParticles={true}
            disableRotation={false}
          />
        </div>
        <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,transparent_40%,rgba(0,0,0,0.65)_100%)]" />
        <div className="relative z-10">
          <Nav />
          <AnimatePresence mode="wait">
            <PageTransition
              key={location.pathname}
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
