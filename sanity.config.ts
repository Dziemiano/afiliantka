"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "default",
  title: "Offers Landing CMS",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Treści")
          .items([
            S.listItem()
              .title("Ustawienia strony")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Ustawienia strony")
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "siteSettings"
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: [
      {
        name: "offer",
        title: "Offer",
        type: "document",
        fields: [
          {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "description",
            title: "Description",
            type: "array",
            of: [{ type: "block" }],
            validation: (Rule) => Rule.required(),
          },
          {
            name: "image",
            title: "Image",
            type: "image",
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
          },
          {
            name: "link",
            title: "Link",
            type: "url",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "featured",
            title: "Featured Offer",
            type: "boolean",
            description:
              "Mark this offer as featured to display it prominently",
            initialValue: false,
          },
          {
            name: "category",
            title: "Category",
            type: "string",
            options: {
              list: [
                { title: "Personal", value: "personal" },
                { title: "Business", value: "business" },
                { title: "Credit Cards", value: "credit-cards" },
              ],
              layout: "radio",
            },
            validation: (Rule) => Rule.required(),
          },
          {
            name: "files",
            title: "Files (PDF)",
            type: "array",
            of: [
              {
                type: "file",
                options: {
                  accept: "application/pdf",
                },
              },
            ],
            validation: (Rule) => Rule.optional(),
          },
          {
            name: "bonusRequirement",
            title: "Wymaganie bonusu (publiczne)",
            type: "string",
            description:
              "Co musi zrobić odwiedzający, żeby dostać bonus (np. 'Załóż konto i wpłać 1000 zł w 30 dni')",
          },
          {
            name: "requirement",
            title: "Wymaganie onboardingu",
            type: "string",
            description:
              "Wymaganie dla współpracownika podczas onboardingu (np. 'Założyć konto i dokonać pierwszej transakcji')",
          },
          {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
              source: "title",
              maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
          },
        ],
        preview: {
          select: {
            title: "title",
            category: "category",
            featured: "featured",
            media: "image",
          },
          prepare({ title, category, featured, media }) {
            const categoryLabels: Record<string, string> = {
              personal: "Konto osobiste",
              business: "Konto firmowe",
              "credit-cards": "Karta kredytowa",
            };
            const categoryLabel =
              categoryLabels[category] || "Bez przypisanej kategorii";

            return {
              title,
              subtitle: `${categoryLabel}${featured ? " · Polecana" : ""}`,
              media,
            };
          },
        },
      },
      {
        name: "heroSection",
        title: "Hero Section",
        type: "document",
        fields: [
          {
            name: "title",
            title: "Hero Title",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "description",
            title: "Hero Description",
            type: "array",
            of: [{ type: "block" }],
            validation: (Rule) => Rule.required(),
          },
          {
            name: "image",
            title: "Hero Background Image (deprecated)",
            type: "image",
            options: { hotspot: true },
            hidden: true,
            description:
              "Nieużywane — hero wyświetla tylko tytuł i opis. Pole zachowane dla istniejących danych.",
          },
        ],
      },
      {
        name: "siteSettings",
        title: "Ustawienia strony",
        type: "document",
        fields: [
          {
            name: "logo",
            title: "Logo (header)",
            type: "image",
            options: { hotspot: true },
            description: "Wordmark Afiliantka Faceless — gdy brak, wyświetlany jest tekst",
          },
          {
            name: "showBlog",
            title: "Pokaż Blog",
            type: "boolean",
            description: "Link Blog w nawigacji oraz dostępność tras /blog",
            initialValue: true,
          },
          {
            name: "showLogin",
            title: "Pokaż Zaloguj się",
            type: "boolean",
            description:
              "CTA Zaloguj / Dashboard w publicznym headerze (bezpośredni URL /login nadal działa)",
            initialValue: true,
          },
          {
            name: "instagramUrl",
            title: "Instagram URL",
            type: "url",
            validation: (Rule) =>
              Rule.uri({ scheme: ["http", "https"] }).optional(),
          },
          {
            name: "facebookUrl",
            title: "Facebook URL",
            type: "url",
            validation: (Rule) =>
              Rule.uri({ scheme: ["http", "https"] }).optional(),
          },
          {
            name: "tiktokUrl",
            title: "TikTok URL",
            type: "url",
            validation: (Rule) =>
              Rule.uri({ scheme: ["http", "https"] }).optional(),
          },
        ],
        preview: {
          prepare() {
            return { title: "Ustawienia strony" };
          },
        },
      },
      {
        name: "blog",
        title: "Blog Post",
        type: "document",
        fields: [
          {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title", maxLength: 96 },
            validation: (Rule) => Rule.required(),
          },
          {
            name: "content",
            title: "Content",
            type: "array",
            of: [
              { type: "block" },
              {
                type: "image",
                options: { hotspot: true },
                fields: [
                  {
                    name: "alt",
                    title: "Alt text",
                    type: "string",
                  },
                ],
              },
            ],
            validation: (Rule) => Rule.required(),
          },
          {
            name: "image",
            title: "Image",
            type: "image",
            options: { hotspot: true },
            validation: (Rule) => Rule.optional(),
          },
          {
            name: "date",
            title: "Date",
            type: "datetime",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "author",
            title: "Author",
            type: "string",
            validation: (Rule) => Rule.optional(),
          },
          {
            name: "relatedOffers",
            title: "Powiązane oferty",
            type: "array",
            of: [{ type: "reference", to: [{ type: "offer" }] }],
          },
        ],
      },
      {
        name: "testimonial",
        title: "Testimonial",
        type: "document",
        fields: [
          {
            name: "quote",
            title: "Cytat",
            type: "text",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "author",
            title: "Autor",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "role",
            title: "Rola / opis",
            type: "string",
            description: "np. Współpracownik od 2024",
          },
          {
            name: "image",
            title: "Zdjęcie",
            type: "image",
            options: { hotspot: true },
          },
          {
            name: "order",
            title: "Kolejność",
            type: "number",
            initialValue: 0,
          },
        ],
      },
      {
        name: "faq",
        title: "FAQ",
        type: "document",
        fields: [
          {
            name: "question",
            title: "Question",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "answer",
            title: "Answer",
            type: "text",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "order",
            title: "Order",
            type: "number",
            initialValue: 0,
          },
        ],
      },
      {
        name: "howItWorks",
        title: "How It Works",
        type: "document",
        fields: [
          {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "description",
            title: "Description",
            type: "text",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "icon",
            title: "Icon (emoji or text)",
            type: "string",
            description: "An emoji or short text to display as the step icon",
          },
          {
            name: "order",
            title: "Order",
            type: "number",
            initialValue: 0,
          },
        ],
      },
      {
        name: "cooperationPage",
        title: "Strona współpracy",
        type: "document",
        fields: [
          {
            name: "heroTitle",
            title: "Tytuł hero",
            type: "string",
          },
          {
            name: "heroSubtitle",
            title: "Podtytuł hero",
            type: "text",
          },
          {
            name: "benefits",
            title: "Korzyści współpracy",
            type: "array",
            of: [
              {
                type: "object",
                fields: [
                  { name: "title", title: "Tytuł", type: "string" },
                  { name: "description", title: "Opis", type: "text" },
                  {
                    name: "icon",
                    title: "Ikona (emoji)",
                    type: "string",
                  },
                ],
              },
            ],
          },
          {
            name: "processSteps",
            title: "Proces dołączenia",
            type: "array",
            of: [
              {
                type: "object",
                fields: [
                  { name: "title", title: "Tytuł", type: "string" },
                  { name: "description", title: "Opis", type: "text" },
                  { name: "order", title: "Kolejność", type: "number" },
                ],
              },
            ],
          },
          {
            name: "faq",
            title: "FAQ współpracy",
            type: "array",
            of: [
              {
                type: "object",
                fields: [
                  { name: "question", title: "Pytanie", type: "string" },
                  { name: "answer", title: "Odpowiedź", type: "text" },
                ],
              },
            ],
          },
          {
            name: "inviteEmail",
            title: "Email do zaproszeń",
            type: "string",
            description:
              "Adres używany w przycisku „Poproś o zaproszenie”",
          },
        ],
      },
    ],
  },
  basePath: "/studio",
});
