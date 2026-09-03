import { cn } from "@/lib/utils";
import { publicSectionPaddingClassName } from "@/lib/public-surfaces";

interface PublicSectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  maxWidth?: "3xl" | "4xl" | "5xl" | "6xl";
  id?: string;
  "data-home-section"?: string;
}

const maxWidthClassNames = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
} as const;

export function PublicSection({
  children,
  className,
  innerClassName,
  maxWidth = "6xl",
  id,
  "data-home-section": dataHomeSection,
}: PublicSectionProps) {
  return (
    <section
      id={id}
      data-home-section={dataHomeSection}
      className={cn("bg-transparent", publicSectionPaddingClassName, className)}
    >
      <div
        className={cn(
          "mx-auto w-full",
          maxWidthClassNames[maxWidth],
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
