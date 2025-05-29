// sanity.config.ts
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "default",
  title: "Offers Landing CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool()],
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
            type: "text",
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
        ],
      },
    ],
  },
  basePath: "/studio",
});
