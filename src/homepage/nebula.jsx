import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { getWarpRequestedAt } from './warp.js';

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uWarp;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + vec2(11.3, 7.9);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv - 0.5;
    p.x *= uRes.x / uRes.y;
    // gentle parallax against the starfield's hover drift
    p += uMouse * 0.05;

    float t = uTime;
    vec2 s = p * 1.4;

    // domain-warped fbm: q bends the field, r bends it again — the
    // double fold is what makes the clouds billow instead of shimmer
    vec2 q = vec2(
      fbm(s + t * 0.10),
      fbm(s + vec2(5.2, 1.3) - t * 0.07)
    );
    vec2 r = vec2(
      fbm(s + 2.6 * q + vec2(1.7, 9.2) + t * 0.15),
      fbm(s + 2.6 * q + vec2(8.3, 2.8) - t * 0.12)
    );
    float f = fbm(s + 2.4 * r);

    vec3 deepIndigo = vec3(0.020, 0.026, 0.070);
    vec3 violet = vec3(0.17, 0.075, 0.28);
    vec3 teal = vec3(0.020, 0.115, 0.155);
    vec3 wisp = vec3(0.46, 0.30, 0.68);
    vec3 core = vec3(0.55, 0.28, 0.60);

    vec3 col = mix(deepIndigo, violet, clamp(f * f * 2.6, 0.0, 1.0));
    col = mix(col, teal, clamp(length(q) * 0.6, 0.0, 1.0));
    col += wisp * pow(clamp(f, 0.0, 1.0), 3.0) * 0.5;
    // hot magenta cores where the field folds hardest
    col += core * pow(clamp(f, 0.0, 1.0), 5.0) * 0.45;

    // patchiness: let stretches of sky fall back to near-black so the
    // nebula reads as distinct clouds, not a uniform color wash
    float mask = smoothstep(0.2, 0.8, fbm(s * 0.5 + r * 0.5 + 2.0));
    col *= 0.3 + 0.85 * mask;

    // fade toward the edges to meet the page vignette
    float vig = smoothstep(1.25, 0.35, length(p));
    col *= mix(0.55, 1.0, vig) * 1.2;

    // hyperspace: the whole sky lifts and cools toward blue
    col *= 1.0 + uWarp * 0.8;
    col += uWarp * vec3(0.02, 0.035, 0.07);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// mirrors the particle field's warp envelope so both layers breathe together
const WARP_HOLD_MS = 1000;

export default function Nebula({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let renderer;
    try {
      renderer = new Renderer({
        // the clouds are low-frequency, so render at half resolution and
        // let the browser upscale — invisible quality loss, 4x cheaper
        dpr: Math.min(window.devicePixelRatio || 1, 2) * 0.5,
        alpha: false,
        depth: false,
        antialias: false,
      });
    } catch {
      container.style.background =
        'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(56,38,110,0.18), transparent 70%), radial-gradient(ellipse 70% 55% at 75% 65%, rgba(20,70,90,0.12), transparent 70%)';
      return;
    }

    const gl = renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: Math.random() * 100 },
        uRes: { value: [1, 1] },
        uMouse: { value: [0, 0] },
        uWarp: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      if (reduceMotion) renderer.render({ scene: mesh });
    };
    window.addEventListener('resize', resize, false);
    resize();

    if (reduceMotion) {
      renderer.render({ scene: mesh });
      return () => {
        window.removeEventListener('resize', resize);
        if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      };
    }

    const mouseTarget = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId;
    let lastTime = performance.now();
    let nebTime = program.uniforms.uTime.value;
    // arrive out of hyperspace glowing, like the starfield does
    let warpAmount = 1;

    const update = (t) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = Math.min(t - lastTime, 64);
      lastTime = t;

      const sinceWarp = t - getWarpRequestedAt();
      const warpTarget = sinceWarp < WARP_HOLD_MS ? 1 : 0;
      const tau = warpTarget > warpAmount ? 220 : 600;
      warpAmount += (warpTarget - warpAmount) * (1 - Math.exp(-delta / tau));

      // clouds drift slowly at cruise, rush during a jump
      nebTime += delta * 0.001 * (0.35 + warpAmount * 2.2);

      const mouse = program.uniforms.uMouse.value;
      const ease = 1 - Math.exp(-delta / 400);
      mouse[0] += (mouseTarget.x - mouse[0]) * ease;
      mouse[1] += (mouseTarget.y - mouse[1]) * ease;

      program.uniforms.uTime.value = nebTime;
      program.uniforms.uWarp.value = warpAmount;

      renderer.render({ scene: mesh });
    };
    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
