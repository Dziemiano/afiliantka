interface PortableTextBlock {
  _type?: string;
  children?: Array<{ text?: string }>;
}

export function portableTextToPlainText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return content
    .filter(
      (block): block is PortableTextBlock =>
        !!block && typeof block === "object" && block._type === "block"
    )
    .map((block) => {
      if (!Array.isArray(block.children)) return "";
      return block.children.map((child) => child.text ?? "").join("");
    })
    .join("\n\n")
    .trim();
}

export function filterPortableTextBlocks(
  content: unknown
): PortableTextBlock[] {
  if (!Array.isArray(content)) return [];
  return content.filter(
    (block): block is PortableTextBlock =>
      !!block && typeof block === "object" && !!block._type
  );
}
