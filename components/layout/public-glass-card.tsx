import { cn } from "@/lib/utils";
import {
  publicGlassCardHoverClassName,
  publicGlassSurfaceClassName,
} from "@/lib/public-surfaces";

interface PublicGlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "details";
}

export function PublicGlassCard({
  children,
  className,
  hover = false,
  as: Component = "div",
}: PublicGlassCardProps) {
  return (
    <Component
      className={cn(
        publicGlassSurfaceClassName,
        hover && publicGlassCardHoverClassName,
        className
      )}
    >
      {children}
    </Component>
  );
}
