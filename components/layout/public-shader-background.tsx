"use client";

import { useSyncExternalStore } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import {
  getPublicShaderSpeeds,
  PUBLIC_SHADER_BASE_COLORS,
  PUBLIC_SHADER_CONTAINER_CLASS_NAME,
  PUBLIC_SHADER_LAYER_STYLES,
  PUBLIC_SHADER_OVERLAY_COLORS,
} from "@/components/layout/public-shader-background-config";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const BASE_COLORS: string[] = [...PUBLIC_SHADER_BASE_COLORS];
const OVERLAY_COLORS: string[] = [...PUBLIC_SHADER_OVERLAY_COLORS];
const BASE_STYLE = {
  backgroundColor: PUBLIC_SHADER_LAYER_STYLES.base.backgroundColor,
};
const OVERLAY_STYLE = {
  backgroundColor: PUBLIC_SHADER_LAYER_STYLES.overlay.backgroundColor,
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
  const speeds = getPublicShaderSpeeds(prefersReducedMotion);

  return (
    <div
      aria-hidden="true"
      className={PUBLIC_SHADER_CONTAINER_CLASS_NAME}
      data-reduced-motion={prefersReducedMotion}
    >
      <MeshGradient
        className={PUBLIC_SHADER_LAYER_STYLES.base.className}
        colors={BASE_COLORS}
        speed={speeds.base}
        style={BASE_STYLE}
      />
      <MeshGradient
        className={PUBLIC_SHADER_LAYER_STYLES.overlay.className}
        colors={OVERLAY_COLORS}
        speed={speeds.overlay}
        style={OVERLAY_STYLE}
      />
    </div>
  );
}
