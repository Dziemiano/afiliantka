import { cn } from "@/lib/utils";

export const publicGlassSurfaceClassName =
  "rounded-3xl border border-white/45 bg-white/45 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl";

export const publicGlassCardHoverClassName =
  "transition-all duration-200 hover:border-white/70 hover:bg-white/60 hover:shadow-xl";

export const publicSolidContentClassName =
  "rounded-2xl border border-white/50 bg-white/90 shadow-[0_8px_32px_rgba(15,23,42,0.08)]";

export const publicSectionPaddingClassName =
  "px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20";

export const publicSectionHeadingClassName =
  "text-white text-2xl sm:text-3xl font-bold drop-shadow-sm";

export const publicSectionSubheadingClassName =
  "text-white/80 text-base sm:text-lg max-w-xl mx-auto";

export function publicGlassSurface(
  className?: string,
  options?: { hover?: boolean }
) {
  return cn(
    publicGlassSurfaceClassName,
    options?.hover && publicGlassCardHoverClassName,
    className
  );
}

export function publicSolidContent(className?: string) {
  return cn(publicSolidContentClassName, className);
}
