let requestedAt = 0;
// the on-load arrival gets a random heading too, so no two visits
// drop out of hyperspace from quite the same angle
let direction = {
  x: (Math.random() * 2 - 1) * 0.5,
  y: (Math.random() * 2 - 1) * 0.5,
  z: 1,
};

export function triggerWarp(dir = { x: 0, y: 0, z: 1 }) {
  direction = dir;
  requestedAt = performance.now();
}

export function getWarpRequestedAt() {
  return requestedAt;
}

export function getWarpDirection() {
  return direction;
}
