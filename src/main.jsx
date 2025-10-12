import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Body from './homepage/body.jsx'
import Particles from './homepage/particles.jsx';
import About from './about/about.jsx';
import Contact from './contact/contact.jsx';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './main.css';
import HomeButton from './homebutton.jsx';

const root = createRoot(document.getElementById("root"));

function Homepage() {
  return (
    <AnimatePresence mode="wait">
      <div className="relative z-10">
        <Body />
      </div>
    </AnimatePresence>
  );
}

const router = createBrowserRouter([
  {path: '/', element: <Homepage />},
  {path: '/about', element: <About />},
  {path: '/contact', element: <Contact />}
])

root.render(
  <StrictMode>
    
    <div className="min-h-screen bg-black relative">
      {}
      <div className="absolute inset-0">
        <Particles
          particleColors={['#ffffffff', '#ffffffff']}
          particleCount={1000}
          particleSpread={10}
          speed={0.02} 
          particleBaseSize={75}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
        
      </div>
    
      {}
      <div className="relative z-10">
        <RouterProvider router={router} />
        
        </div>
    </div>
  </StrictMode>
)
