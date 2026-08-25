"use client";

import { useSyncExternalStore } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import {
  getPublicShaderSpeed,
  PUBLIC_SHADER_COLORS,
  PUBLIC_SHADER_FRAME,
} from "@/components/layout/public-shader-background-config";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SHADER_COLORS: string[] = [...PUBLIC_SHADER_COLORS];
const SHADER_STYLE = { width: "100%", height: "100%" } as const;
const WEBGL_CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  powerPreference: "low-power",
};

function subscribeToReducedMotion(onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return true;
}

export function PublicShaderBackground() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(135deg,#000000_0%,#164e63_30%,#0891b2_55%,#06b6d4_75%,#f97316_100%)]"
      data-reduced-motion={prefersReducedMotion}
    >
      <MeshGradient
        colors={SHADER_COLORS}
        distortion={0.7}
        swirl={0.2}
        grainMixer={0}
        grainOverlay={0}
        speed={getPublicShaderSpeed(prefersReducedMotion)}
        frame={PUBLIC_SHADER_FRAME}
        fit="cover"
        minPixelRatio={1}
        maxPixelCount={1920 * 1080}
        webGlContextAttributes={WEBGL_CONTEXT_ATTRIBUTES}
        style={SHADER_STYLE}
      />
      <div className="absolute inset-0 bg-white/65" />
    </div>
  );
}
