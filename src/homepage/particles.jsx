import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';
import { getWarpRequestedAt, getWarpDirection } from './warp.js';

//import './Particles.css';

const defaultColors = ['#ffffff', '#ffffff', '#ffffff'];

const hexToRgb = hex => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  uniform float uWarp;
  uniform vec3 uWarpVel;
  uniform vec3 uWarpOff;

  varying vec4 vRandom;
  varying vec3 vColor;
  varying vec2 vDir;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    // warp travel: fly through the field along the jump heading,
    // recycling particles by wrapping each axis
    float xyRange = uSpread;
    float zRange = uSpread * 10.0;
    pos.x = mod(pos.x + uWarpOff.x + xyRange, 2.0 * xyRange) - xyRange;
    pos.y = mod(pos.y + uWarpOff.y + xyRange, 2.0 * xyRange) - xyRange;
    pos.z = mod(pos.z + uWarpOff.z + zRange, 2.0 * zRange) - zRange;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }
    gl_PointSize *= 1.0 + uWarp * 12.0;
    // keep close fly-bys as tight streaks instead of giant fuzzy discs
    gl_PointSize = min(gl_PointSize, mix(1000.0, 160.0, uWarp));

    gl_Position = projectionMatrix * mvPos;

    // screen-space motion direction, for orienting warp streaks
    vec4 clipPrev = projectionMatrix * viewMatrix * modelMatrix * vec4(pos - uWarpVel * 4.0, 1.0);
    vec2 ndcNow = gl_Position.xy / max(gl_Position.w, 0.0001);
    vec2 ndcPrev = clipPrev.xy / max(clipPrev.w, 0.0001);
    vDir = ndcNow - ndcPrev;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  uniform float uWarp;
  varying vec4 vRandom;
  varying vec3 vColor;
  varying vec2 vDir;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    vec2 p = uv - vec2(0.5);
    float d = length(p);

    // streak along the particle's screen-space motion: a soft gaussian
    // capsule, cross-faded with the resting dot by uWarp
    float w = clamp(uWarp, 0.0, 1.0);
    vec2 dir = vec2(1.0, 0.0);
    float dirLen = length(vDir);
    if (dirLen > 0.00001) {
      // gl_PointCoord y is inverted relative to NDC
      dir = vec2(vDir.x, -vDir.y) / dirLen;
    }
    float along = dot(p, dir);
    float perp = dot(p, vec2(-dir.y, dir.x));
    float streak = exp(-perp * perp * 60.0) * exp(-along * along * 4.0);

    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      float alpha = mix(circle, streak, w);
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), alpha);
    }
  }
`;

const Particles = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  className
}) => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ depth: false, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize, false);
    resize();

    const handleMouseMove = e => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    if (moveParticlesOnHover) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
        uWarp: { value: 0 },
        uWarpVel: { value: [0, 0, 0.5] },
        uWarpOff: { value: [0, 0, 0] }
      },
      transparent: true,
      depthTest: false
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId;
    let lastTime = performance.now();
    let elapsed = 0;

    // start at full warp so the site "arrives" out of hyperspace on load
    let warpAmount = 1;
    const WARP_HOLD_MS = 450;
    const xyWrap = particleSpread * 2;
    const zWrap = particleSpread * 20;

    const update = t => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      const sinceWarp = t - getWarpRequestedAt();
      const warpTarget = sinceWarp < WARP_HOLD_MS ? 1 : 0;
      const tau = warpTarget > warpAmount ? 90 : 280;
      warpAmount += (warpTarget - warpAmount) * (1 - Math.exp(-delta / tau));

      const dir = getWarpDirection();
      const vel = program.uniforms.uWarpVel.value;
      const off = program.uniforms.uWarpOff.value;
      vel[0] = dir.x * 0.07;
      vel[1] = dir.y * 0.07;
      vel[2] = dir.z * 0.6;
      off[0] = (off[0] + warpAmount * delta * vel[0]) % xyWrap;
      off[1] = (off[1] + warpAmount * delta * vel[1]) % xyWrap;
      off[2] = (off[2] + warpAmount * delta * vel[2]) % zWrap;
      program.uniforms.uWarp.value = warpAmount;

      if (moveParticlesOnHover) {
        const targetX = -mouseRef.current.x * particleHoverFactor;
        const targetY = -mouseRef.current.y * particleHoverFactor;
        particles.position.x += (targetX - particles.position.x) * 0.04;
        particles.position.y += (targetY - particles.position.y) * 0.04;
      } else {
        particles.position.x = 0;
        particles.position.y = 0;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation
  ]);

  return <div ref={containerRef} className={`particles-container ${className}`} />;
};

export default Particles;
