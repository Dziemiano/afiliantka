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
  plugins: [structureTool(), visionTool()],
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
            type: "text",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "image",
            title: "Hero Background Image",
            type: "image",
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
          },
        ],
      },
      {
        name: "news",
        title: "News",
        type: "document",
        fields: [
          {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "content",
            title: "Content",
            type: "text",
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
        ],
      },
    ],
  },
  basePath: "/studio",
});
