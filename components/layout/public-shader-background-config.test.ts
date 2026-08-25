import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  getPublicShaderSpeed,
  PUBLIC_SHADER_COLORS,
  PUBLIC_SHADER_FRAME,
  PUBLIC_SHADER_SPEED,
} from "./public-shader-background-config";

const backgroundSource = readFileSync(
  new URL("./public-shader-background.tsx", import.meta.url),
  "utf8"
);
const websiteLayoutSource = readFileSync(
  new URL("../../app/(website)/layout.tsx", import.meta.url),
  "utf8"
);

describe("public shader background contract", () => {
  it("keeps the approved palette and deterministic animation settings", () => {
    expect(PUBLIC_SHADER_COLORS).toEqual([
      "#000000",
      "#06b6d4",
      "#0891b2",
      "#164e63",
      "#f97316",
    ]);
    expect(PUBLIC_SHADER_FRAME).toBe(3200);
    expect(getPublicShaderSpeed(false)).toBe(PUBLIC_SHADER_SPEED);
    expect(getPublicShaderSpeed(true)).toBe(0);
  });

  it("mounts only through the shared public layout", () => {
    expect(websiteLayoutSource).toContain("<PublicShaderBackground />");
    expect(websiteLayoutSource).toContain("overflow-x-clip");
  });

  it("uses stable rendering inputs without random values", () => {
    expect(backgroundSource).toContain("useSyncExternalStore");
    expect(backgroundSource).toContain("maxPixelCount={1920 * 1080}");
    expect(backgroundSource).not.toContain("Math.random");
  });
});
