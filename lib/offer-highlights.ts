import { portableTextToPlainText } from "@/lib/portable-text";

const DEFAULT_MAX_ITEMS = 4;
const MAX_ITEM_LENGTH = 140;
const AMOUNT_PATTERN = /(\d[\d\s]*(?:,\d+)?\s*(?:zł|%))/gi;
const HIGHLIGHT_SIGNAL =
  /(\d[\d\s]*(?:,\d+)?\s*(?:zł|%))|premii|bonus|blik/i;

interface PortableBlock {
  _type?: string;
  listItem?: string;
  children?: Array<{ text?: string }>;
}

export interface EmphasizedTextPart {
  text: string;
  bold: boolean;
}

function isPortableBlock(value: unknown): value is PortableBlock {
  return !!value && typeof value === "object" && "_type" in value;
}

function cleanHighlightText(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/(?:\\n|\n)\d+\.?$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function blockText(block: PortableBlock): string {
  if (!Array.isArray(block.children)) return "";
  return cleanHighlightText(
    block.children.map((child) => child.text ?? "").join("")
  );
}

function isUsableHighlight(text: string): boolean {
  if (text.length < 8) return false;
  if (/^\d+\.?$/.test(text)) return false;
  if (/^kliknij w link\.?$/i.test(text)) return false;
  if (/^co zyskujesz\??$/i.test(text)) return false;
  return true;
}

function truncateHighlight(text: string): string {
  if (text.length <= MAX_ITEM_LENGTH) return text;
  return `${text.slice(0, MAX_ITEM_LENGTH - 1).trimEnd()}…`;
}

function isListBlock(block: PortableBlock): boolean {
  return block.listItem === "bullet" || block.listItem === "number";
}

function looksLikeHighlight(text: string): boolean {
  return text.length <= 160 && HIGHLIGHT_SIGNAL.test(text);
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((paragraph) => paragraph.split(/(?<=[.!?])\s+/))
    .map((part) => part.trim())
    .filter(Boolean);
}

function alreadyListed(items: string[], candidate: string): boolean {
  const needle = candidate.toLowerCase();
  return items.some((item) => {
    const haystack = item.toLowerCase();
    return haystack.includes(needle) || needle.includes(haystack);
  });
}

export function emphasizeOfferAmounts(text: string): EmphasizedTextPart[] {
  const parts: EmphasizedTextPart[] = [];
  const pattern = new RegExp(AMOUNT_PATTERN.source, AMOUNT_PATTERN.flags);
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    parts.push({ text: match[1], bold: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), bold: false });
  }

  return parts.length > 0 ? parts : [{ text, bold: false }];
}

export function getOfferHighlights(
  offer: { description?: unknown; bonusRequirement?: string },
  maxItems = DEFAULT_MAX_ITEMS
): string[] {
  const limit = Math.max(0, maxItems);
  if (limit === 0) return [];

  const blocks = Array.isArray(offer.description)
    ? offer.description.filter(isPortableBlock)
    : [];

  const listItems = blocks
    .filter(isListBlock)
    .map(blockText)
    .filter(isUsableHighlight)
    .map(truncateHighlight);

  const paragraphHighlights = blocks
    .filter((block) => !isListBlock(block))
    .map(blockText)
    .filter((text) => looksLikeHighlight(text) && isUsableHighlight(text))
    .map(truncateHighlight);

  const fallbackParagraphs = splitParagraphs(
    portableTextToPlainText(offer.description)
  )
    .map(cleanHighlightText)
    .filter(isUsableHighlight)
    .map(truncateHighlight);

  const items =
    listItems.length > 0
      ? [...listItems]
      : paragraphHighlights.length > 0
        ? [...paragraphHighlights]
        : fallbackParagraphs;

  const requirement = offer.bonusRequirement?.trim();
  const hasStructuredHighlights =
    listItems.length > 0 || paragraphHighlights.length > 0;
  if (
    requirement &&
    !hasStructuredHighlights &&
    !alreadyListed(items, requirement)
  ) {
    items.unshift(truncateHighlight(requirement));
  }

  const unique: string[] = [];
  for (const item of items) {
    if (!item || alreadyListed(unique, item)) continue;
    unique.push(item);
    if (unique.length >= limit) break;
  }

  return unique;
}
