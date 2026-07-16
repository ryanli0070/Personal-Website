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
  uniform vec3 uWarpOff;
  uniform vec3 uWarpVel;
  uniform vec2 uResolution;

  varying vec4 vRandom;
  varying vec3 vColor;
  varying vec2 vStreakDir;
  varying float vStretch;

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
    vec3 wobble = vec3(
      sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x),
      sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w),
      sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z)
    );
    mPos.xyz += wobble;

    vec4 mvPos = viewMatrix * mPos;
    vec4 clip = projectionMatrix * mvPos;

    float size;
    if (uSizeRandomness == 0.0) {
      size = uBaseSize;
    } else {
      size = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }
    // a gentle swell during warp
    size *= 1.0 + uWarp * 0.5;
    size = min(size, mix(56.0, 72.0, uWarp));

    // motion streak: exact screen-space velocity via the projection's
    // derivative at the star's current spot — a two-point lookahead would
    // cross the camera plane on forward jumps and skew the direction
    vec4 clipV = projectionMatrix * viewMatrix * modelMatrix * vec4(uWarpVel, 0.0);
    float wA = max(clip.w, 1e-4);
    vec2 ndcA = clip.xy / wA;
    vec2 screenVel = (clipV.xy - ndcA * clipV.w) / wA * uResolution * 0.5;
    float streak = length(screenVel);
    float stretch = clamp(1.0 + streak / max(size, 1.0), 1.0, 6.0);

    vStretch = stretch;
    // gl_PointCoord's y runs top-down, so flip y to match screen space
    vec2 dir = vec2(1.0, 0.0);
    if (streak > 1e-3) dir = normalize(screenVel * vec2(1.0, -1.0));
    vStreakDir = dir;

    // grow the sprite square so the oval's long axis fits inside it
    gl_PointSize = min(size * stretch, 420.0);
    gl_Position = clip;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  uniform float uWarp;
  varying vec4 vRandom;
  varying vec3 vColor;
  varying vec2 vStreakDir;
  varying float vStretch;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float w = clamp(uWarp, 0.0, 1.0);

    // measure distance in the streak's frame: squashing the cross axis
    // turns the dot into a smooth oval with rounded ends, never a bar
    vec2 p = uv - vec2(0.5);
    float along = dot(p, vStreakDir);
    float across = dot(p, vec2(-vStreakDir.y, vStreakDir.x));
    float d = length(vec2(along, across * vStretch));

    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      // soften the falloff as warp ramps so streaks read as motion blur;
      // brighten to offset the light smearing along the trail
      float edge = mix(0.4, 0.18, w);
      float oval = smoothstep(0.5, edge, d) * mix(0.8, 1.35, w);
      oval *= mix(1.0, inversesqrt(vStretch), 0.6);
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), oval);
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
      // uniform box so the field covers the view evenly (a long tunnel
      // once z is stretched in the shader) with no clumps or gaps
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const z = Math.random() * 2 - 1;
      positions.set([x, y, z], i * 3);
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
        uWarpOff: { value: [0, 0, 0] },
        uWarpVel: { value: [0, 0, 0] },
        uResolution: { value: [1, 1] }
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
    const WARP_HOLD_MS = 1000;
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
      // slow spin-up, even slower wind-down: a real accel/decel arc
      const tau = warpTarget > warpAmount ? 220 : 600;
      warpAmount += (warpTarget - warpAmount) * (1 - Math.exp(-delta / tau));

      // the heading is meant camera-relative, but travel happens in the
      // field's local axes and the field slowly tumbles — counter-rotate
      // the heading (Rᵀ·v) so the vanishing point lands where dir says
      const dir = getWarpDirection();
      const m = particles.worldMatrix;
      const wx = dir.x * 0.07;
      const wy = dir.y * 0.07;
      const wz = dir.z * 0.6;
      const vx = m[0] * wx + m[1] * wy + m[2] * wz;
      const vy = m[4] * wx + m[5] * wy + m[6] * wz;
      const vz = m[8] * wx + m[9] * wy + m[10] * wz;

      const off = program.uniforms.uWarpOff.value;
      off[0] = (off[0] + warpAmount * delta * vx) % xyWrap;
      off[1] = (off[1] + warpAmount * delta * vy) % xyWrap;
      off[2] = (off[2] + warpAmount * delta * vz) % zWrap;
      program.uniforms.uWarp.value = warpAmount;

      // streak lookahead: how many ms of travel each star smears across
      const STREAK_MS = 60;
      const vel = program.uniforms.uWarpVel.value;
      vel[0] = warpAmount * vx * STREAK_MS;
      vel[1] = warpAmount * vy * STREAK_MS;
      vel[2] = warpAmount * vz * STREAK_MS;

      const res = program.uniforms.uResolution.value;
      res[0] = gl.canvas.width;
      res[1] = gl.canvas.height;

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
