import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { MeshGradientProps } from "@paper-design/shaders-react";
import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";

const shaderCalls = vi.hoisted(() => [] as MeshGradientProps[]);

vi.mock("@paper-design/shaders-react", async () => {
  const { createElement: createMockElement } = await import("react");

  return {
    MeshGradient: (props: MeshGradientProps) => {
      shaderCalls.push(props);
      return createMockElement("div", {
        "data-shader-layer": shaderCalls.length,
      });
    },
  };
});

import { PublicShaderBackground } from "./public-shader-background";

describe("PublicShaderBackground", () => {
  beforeEach(() => {
    shaderCalls.length = 0;
  });

  it("uses the supported style API and has no wireframe shader prop", () => {
    type WireframeIsAbsent = "wireframe" extends keyof MeshGradientProps
      ? false
      : true;

    expectTypeOf<WireframeIsAbsent>().toEqualTypeOf<true>();
    expectTypeOf<MeshGradientProps["style"]>().toMatchTypeOf<
      React.CSSProperties | undefined
    >();
  });

  it("renders the fixed non-interactive wrapper and exact two layers", () => {
    const markup = renderToStaticMarkup(createElement(PublicShaderBackground));

    expect(markup).toContain(
      'class="pointer-events-none fixed inset-0 z-0 overflow-hidden"'
    );
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('data-reduced-motion="true"');
    expect(shaderCalls).toHaveLength(2);

    expect(shaderCalls[0]).toMatchObject({
      className: "absolute inset-0 w-full h-full",
      colors: ["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"],
      speed: 0,
      style: { backgroundColor: "#000000" },
    });
    expect(shaderCalls[1]).toMatchObject({
      className: "absolute inset-0 w-full h-full opacity-50",
      colors: ["#000000", "#ffffff", "#06b6d4", "#f97316"],
      speed: 0,
      style: { backgroundColor: "transparent" },
    });
    expect(shaderCalls[0]).not.toHaveProperty("wireframe");
    expect(shaderCalls[1]).not.toHaveProperty("wireframe");
  });

  it("reuses deterministic layer inputs across renders", () => {
    renderToStaticMarkup(createElement(PublicShaderBackground));
    const firstRender = [...shaderCalls];

    shaderCalls.length = 0;
    renderToStaticMarkup(createElement(PublicShaderBackground));

    expect(shaderCalls[0].colors).toBe(firstRender[0].colors);
    expect(shaderCalls[0].style).toBe(firstRender[0].style);
    expect(shaderCalls[1].colors).toBe(firstRender[1].colors);
    expect(shaderCalls[1].style).toBe(firstRender[1].style);
  });

  it("stays scoped to the transparent public layout", () => {
    const repositoryRoot = process.cwd();
    const websiteLayout = readFileSync(
      path.join(repositoryRoot, "app/(website)/layout.tsx"),
      "utf8"
    );
    const appLayouts = [
      "app/layout.tsx",
      "app/(app)/admin/layout.tsx",
      "app/(app)/dashboard/layout.tsx",
    ].map((file) => readFileSync(path.join(repositoryRoot, file), "utf8"));

    expect(websiteLayout).toContain("<PublicShaderBackground />");
    expect(websiteLayout).toContain(
      'className="relative isolate min-h-screen overflow-x-clip"'
    );
    expect(websiteLayout).toContain('className="flex-1 outline-none"');
    for (const appLayout of appLayouts) {
      expect(appLayout).not.toContain("PublicShaderBackground");
    }
  });
});
