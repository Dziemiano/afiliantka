export const PUBLIC_SHADER_COLORS = [
  "#000000",
  "#06b6d4",
  "#0891b2",
  "#164e63",
  "#f97316",
] as const;

export const PUBLIC_SHADER_FRAME = 3200;
export const PUBLIC_SHADER_SPEED = 0.18;

export function getPublicShaderSpeed(prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? 0 : PUBLIC_SHADER_SPEED;
}
