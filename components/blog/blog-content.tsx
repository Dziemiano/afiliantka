import { PortableText, type PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity-image";
import {
  filterPortableTextBlocks,
  portableTextToPlainText,
} from "@/lib/portable-text";

interface LinkValue {
  href: string;
}

interface BlogContentProps {
  content: unknown;
}

export function readingTimeFromContent(content: unknown): number {
  const text = portableTextToPlainText(content);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function excerptFromContent(content: unknown, maxLength = 160): string {
  const text = portableTextToPlainText(content);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function BlogContent({ content }: BlogContentProps) {
  if (typeof content === "string") {
    return (
      <article className="prose-offer text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line [&_p]:mb-5 first:[&_p]:text-lg first:[&_p]:text-slate-600">
        {content}
      </article>
    );
  }

  const safeBlocks = filterPortableTextBlocks(content) as PortableTextBlock[];

  return (
    <article className="prose-offer text-slate-700 text-base sm:text-lg leading-relaxed space-y-4 [&_p]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand [&_a]:underline [&_a:hover]:text-brand-dark [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-6 [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600">
      <PortableText
        value={safeBlocks}
        components={{
          types: {
            image: ({
              value,
            }: {
              value?: {
                asset?: { _ref: string; _type: string };
                alt?: string;
              };
            }) =>
              value?.asset ? (
                <div className="relative w-full aspect-[16/10] my-6 rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={urlFor(value).width(900).height(560).url()}
                    alt={value.alt || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </div>
              ) : null,
          },
          marks: {
            link: ({
              value,
              children,
            }: {
              value?: LinkValue;
              children?: React.ReactNode;
            }) => (
              <a
                href={value?.href}
                className="text-brand underline hover:text-brand-dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
          },
        }}
      />
    </article>
  );
}
