export const PUBLIC_SHADER_BASE_COLORS = Object.freeze([
  "#000000",
  "#06b6d4",
  "#0891b2",
  "#164e63",
  "#f97316",
] as const);

export const PUBLIC_SHADER_OVERLAY_COLORS = Object.freeze([
  "#000000",
  "#ffffff",
  "#06b6d4",
  "#f97316",
] as const);

export const PUBLIC_SHADER_CONTAINER_CLASS_NAME =
  "pointer-events-none fixed inset-0 z-0 overflow-hidden";

export const PUBLIC_SHADER_LAYER_STYLES = Object.freeze({
  base: Object.freeze({
    className: "absolute inset-0 w-full h-full",
    backgroundColor: "#000000",
  }),
  overlay: Object.freeze({
    className: "absolute inset-0 w-full h-full opacity-50",
    backgroundColor: "transparent",
  }),
});

const PUBLIC_SHADER_ANIMATED_SPEEDS = Object.freeze({
  base: 0.3,
  overlay: 0.2,
});
const PUBLIC_SHADER_STATIC_SPEEDS = Object.freeze({
  base: 0,
  overlay: 0,
});

export function getPublicShaderSpeeds(prefersReducedMotion: boolean) {
  return prefersReducedMotion
    ? PUBLIC_SHADER_STATIC_SPEEDS
    : PUBLIC_SHADER_ANIMATED_SPEEDS;
}
