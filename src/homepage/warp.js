let requestedAt = 0;
let direction = { x: 0, y: 0, z: 1 };

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
