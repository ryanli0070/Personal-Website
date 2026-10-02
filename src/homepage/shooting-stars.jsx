import { useEffect, useRef } from 'react';

export default function ShootingStars({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };
    window.addEventListener('resize', resize, false);
    resize();

    const stars = [];
    let spawnTimeout;

    const spawn = () => {
      const fromLeft = Math.random() < 0.5;
      const angle = ((18 + Math.random() * 24) * Math.PI) / 180;
      stars.push({
        // start in the upper half so trails fall across open sky
        x: (fromLeft ? -0.05 + Math.random() * 0.55 : 0.5 + Math.random() * 0.55) * width,
        y: Math.random() * height * 0.45,
        dirX: (fromLeft ? 1 : -1) * Math.cos(angle),
        dirY: Math.sin(angle),
        speed: 0.5 + Math.random() * 0.4,
        len: 90 + Math.random() * 80,
        life: 900 + Math.random() * 600,
        age: 0,
      });
      schedule();
    };

    const schedule = () => {
      spawnTimeout = setTimeout(spawn, 3000 + Math.random() * 6000);
    };
    // first one arrives soon enough to be noticed
    spawnTimeout = setTimeout(spawn, 1200 + Math.random() * 1800);

    let animationFrameId;
    let lastTime = performance.now();

    const update = (t) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = Math.min(t - lastTime, 64);
      lastTime = t;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (stars.length === 0) return;

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.age += delta;
        if (s.age >= s.life) {
          stars.splice(i, 1);
          continue;
        }
        s.x += s.dirX * s.speed * delta;
        s.y += s.dirY * s.speed * delta;

        // fade in fast, burn, fade out — one smooth arc
        const alpha = Math.sin(Math.PI * (s.age / s.life)) * 0.9;
        const tailX = s.x - s.dirX * s.len;
        const tailY = s.y - s.dirY * s.len;

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.3, `rgba(200,215,255,${alpha * 0.35})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(spawnTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
