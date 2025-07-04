interface PortableTextBlock {
  _type: string;
  children?: PortableTextChild[];
  [key: string]: unknown;
}

interface PortableTextChild {
  _type: string;
  text?: string;
  [key: string]: unknown;
}

export function portableTextToString(
  portableText: PortableTextBlock[] | string | null | undefined
): string {
  if (!portableText) return "";

  // If it's already a string, return it
  if (typeof portableText === "string") return portableText;

  // If it's an array, process each block
  if (Array.isArray(portableText)) {
    return portableText
      .map((block: PortableTextBlock) => {
        if (block._type === "block") {
          return (
            block.children
              ?.map((child: PortableTextChild) => child.text || "")
              .join("") || ""
          );
        }
        return "";
      })
      .join(" ")
      .trim();
  }

  return "";
}
