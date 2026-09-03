import { PublicSection } from "@/components/layout/public-section";
import {
  publicSectionHeadingClassName,
  publicSectionSubheadingClassName,
} from "@/lib/public-surfaces";
import { cn } from "@/lib/utils";

interface PublicPageHeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  titleAs?: "h1" | "h2";
}

export function PublicPageHero({
  title,
  subtitle,
  children,
  className,
  titleAs: TitleTag = "h1",
}: PublicPageHeroProps) {
  return (
    <PublicSection
      className={cn("py-10 sm:py-14 lg:py-16", className)}
      innerClassName="text-center"
      maxWidth="5xl"
    >
      <TitleTag className={cn(publicSectionHeadingClassName, "mb-3")}>
        {title}
      </TitleTag>
      {subtitle && (
        <p className={publicSectionSubheadingClassName}>{subtitle}</p>
      )}
      {children}
    </PublicSection>
  );
}
