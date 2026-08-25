import { describe, expect, it } from "vitest";
import {
  getPublicShaderAnimationConfig,
  PUBLIC_SHADER_COLORS,
  PUBLIC_SHADER_FRAME,
  PUBLIC_SHADER_SPEED,
} from "./public-shader-background-config";

describe("public shader background contract", () => {
  it("keeps the exact approved palette immutable", () => {
    expect(PUBLIC_SHADER_COLORS).toEqual([
      "#000000",
      "#06b6d4",
      "#0891b2",
      "#164e63",
      "#f97316",
    ]);
    expect(Object.isFrozen(PUBLIC_SHADER_COLORS)).toBe(true);
  });

  it("returns the stable animated configuration", () => {
    const firstConfig = getPublicShaderAnimationConfig(false);
    const secondConfig = getPublicShaderAnimationConfig(false);

    expect(firstConfig).toBe(secondConfig);
    expect(firstConfig).toEqual({
      frame: PUBLIC_SHADER_FRAME,
      speed: PUBLIC_SHADER_SPEED,
    });
    expect(Object.isFrozen(firstConfig)).toBe(true);
  });

  it("returns a stable static configuration for reduced motion", () => {
    const firstConfig = getPublicShaderAnimationConfig(true);
    const secondConfig = getPublicShaderAnimationConfig(true);

    expect(firstConfig).toBe(secondConfig);
    expect(firstConfig).toEqual({
      frame: 3200,
      speed: 0,
    });
    expect(Object.isFrozen(firstConfig)).toBe(true);
  });
});
