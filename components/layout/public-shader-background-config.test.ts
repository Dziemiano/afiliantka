import { describe, expect, it } from "vitest";
import {
  getPublicShaderSpeeds,
  PUBLIC_SHADER_BASE_COLORS,
  PUBLIC_SHADER_LAYER_STYLES,
  PUBLIC_SHADER_OVERLAY_COLORS,
} from "./public-shader-background-config";

describe("public shader background contract", () => {
  it("keeps the exact base layer contract immutable", () => {
    expect(PUBLIC_SHADER_BASE_COLORS).toEqual([
      "#000000",
      "#06b6d4",
      "#0891b2",
      "#164e63",
      "#f97316",
    ]);
    expect(PUBLIC_SHADER_LAYER_STYLES.base).toEqual({
      className: "absolute inset-0 w-full h-full",
      backgroundColor: "#000000",
    });
    expect(Object.isFrozen(PUBLIC_SHADER_BASE_COLORS)).toBe(true);
  });

  it("keeps the exact overlay layer contract immutable", () => {
    expect(PUBLIC_SHADER_OVERLAY_COLORS).toEqual([
      "#000000",
      "#ffffff",
      "#06b6d4",
      "#f97316",
    ]);
    expect(PUBLIC_SHADER_LAYER_STYLES.overlay).toEqual({
      className: "absolute inset-0 w-full h-full opacity-60",
      backgroundColor: "transparent",
    });
    expect(Object.isFrozen(PUBLIC_SHADER_OVERLAY_COLORS)).toBe(true);
  });

  it("returns the exact stable normal-motion speeds", () => {
    const firstConfig = getPublicShaderSpeeds(false);
    const secondConfig = getPublicShaderSpeeds(false);

    expect(firstConfig).toBe(secondConfig);
    expect(firstConfig).toEqual({
      base: 0.3,
      overlay: 0.2,
    });
    expect(Object.isFrozen(firstConfig)).toBe(true);
  });

  it("freezes both unchanged layers for reduced motion", () => {
    const firstConfig = getPublicShaderSpeeds(true);
    const secondConfig = getPublicShaderSpeeds(true);

    expect(firstConfig).toBe(secondConfig);
    expect(firstConfig).toEqual({
      base: 0,
      overlay: 0,
    });
    expect(Object.isFrozen(firstConfig)).toBe(true);
  });
});
