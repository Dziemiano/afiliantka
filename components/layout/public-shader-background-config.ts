export const PUBLIC_SHADER_COLORS = Object.freeze([
  "#000000",
  "#06b6d4",
  "#0891b2",
  "#164e63",
  "#f97316",
] as const);

export const PUBLIC_SHADER_FRAME = 3200;
export const PUBLIC_SHADER_SPEED = 0.18;

const PUBLIC_SHADER_ANIMATED_CONFIG = Object.freeze({
  frame: PUBLIC_SHADER_FRAME,
  speed: PUBLIC_SHADER_SPEED,
});
const PUBLIC_SHADER_STATIC_CONFIG = Object.freeze({
  frame: PUBLIC_SHADER_FRAME,
  speed: 0,
});

export function getPublicShaderAnimationConfig(prefersReducedMotion: boolean) {
  return prefersReducedMotion
    ? PUBLIC_SHADER_STATIC_CONFIG
    : PUBLIC_SHADER_ANIMATED_CONFIG;
}
