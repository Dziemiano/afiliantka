import type { Metadata } from "next";

const BLOG_INDEX_METADATA: Metadata = {
  title: "Blog",
  description:
    "Aktualności, porady i artykuły o promocjach bankowych oraz zakładaniu kont.",
  openGraph: {
    title: "Blog | Afiliantka Faceless",
    description: "Aktualności, porady i artykuły o promocjach bankowych.",
  },
};

/** When blog is disabled, avoid advertising the route in metadata. */
export function blogIndexMetadata(showBlog: boolean): Metadata {
  if (!showBlog) {
    return { title: "Nie znaleziono", robots: { index: false, follow: false } };
  }
  return BLOG_INDEX_METADATA;
}

export function shouldExposeBlogRoutes(showBlog: boolean): boolean {
  return showBlog;
}
