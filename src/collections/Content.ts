import type { CollectionConfig } from "payload";
import { anyone, editors, hiddenUnless, publishedOrSignedIn } from "@/payload/access";
import { revalidateCollection } from "@/payload/revalidate";
import { draftVersions, imageField, publishedAtField, slugField, stampPublishedAt } from "@/payload/fields";

/** Client quotes for the homepage testimonials. */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "company", "showOnWebsite", "order"],
    listSearchableFields: ["name", "company", "quote"],
    group: "Portfolio",
    hidden: hiddenUnless("admin", "editor"),
    description: "Quotes in “What our Milers say” on the homepage. Untick “Show on website” to hide one without deleting it.",
  },
  defaultSort: "order",
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: revalidateCollection("home"),
  fields: [
    { name: "quote", type: "textarea", label: "Quote", required: true, admin: { description: "In the client's own words. Two to four sentences read best." } },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: "Person", required: true },
        { name: "role", type: "text", label: "Role", admin: { placeholder: "Owner" } },
        { name: "company", type: "text", label: "Brand", required: true },
      ],
    },
    {
      name: "showOnWebsite",
      type: "checkbox",
      label: "Show on website",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
    { name: "order", type: "number", label: "Display order", defaultValue: 100, admin: { position: "sidebar", description: "Lower numbers come first." } },
  ],
};

/** Insights articles. Only published ones appear on the site. */
export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "author", "_status", "publishedAt"],
    listSearchableFields: ["title", "excerpt"],
    group: "Insights",
    hidden: hiddenUnless("admin", "editor"),
    description: "Write and save as a draft as often as you like. Readers only see an article after you press Publish.",
  },
  defaultSort: "-publishedAt",
  versions: draftVersions,
  access: { read: publishedOrSignedIn, create: editors, update: editors, delete: editors },
  hooks: { ...revalidateCollection("home", "articles"), beforeChange: [stampPublishedAt] },
  fields: [
    { name: "title", type: "text", label: "Title", required: true },
    {
      type: "tabs",
      tabs: [
        {
          label: "Article",
          fields: [{ name: "content", type: "richText", label: "Article body", admin: { description: "Use headings to break up long sections." } }],
        },
        {
          label: "Card",
          description: "How the article looks in lists and on the homepage.",
          fields: [
            {
              name: "excerpt",
              type: "textarea",
              label: "Excerpt",
              required: true,
              admin: { description: "One or two sentences that make people want to read on (around 200 characters)." },
            },
            imageField({
              name: "cover",
              label: "Cover image",
              required: true,
              admin: { description: "Landscape, at least 1600 × 900 px." },
            }),
            {
              type: "row",
              fields: [
                {
                  name: "category",
                  type: "select",
                  label: "Category",
                  required: true,
                  options: ["Advertising", "Playbook", "Creative", "Research", "Consulting"].map((v) => ({ label: v, value: v })),
                },
                { name: "readingTime", type: "text", label: "Reading time", admin: { placeholder: "6 min read" } },
              ],
            },
          ],
        },
        {
          label: "Author",
          fields: [
            {
              name: "author",
              type: "group",
              label: false,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "name", type: "text", label: "Author name" },
                    { name: "role", type: "text", label: "Author role", admin: { placeholder: "Head of Strategy" } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    slugField("title"),
    publishedAtField(),
  ],
};

/** MIL Research industry reports. Only published ones appear on the site. */
export const Reports: CollectionConfig = {
  slug: "reports",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "industry", "gated", "_status", "publishedAt"],
    listSearchableFields: ["title", "industry", "summary"],
    group: "Insights",
    hidden: hiddenUnless("admin", "editor"),
    description: "Industry reports on /reports. Gated reports ask for a name and email (saved in Leads) before the download.",
  },
  defaultSort: "-publishedAt",
  versions: draftVersions,
  access: { read: publishedOrSignedIn, create: editors, update: editors, delete: editors },
  hooks: { ...revalidateCollection("home", "reports"), beforeChange: [stampPublishedAt] },
  fields: [
    { name: "title", type: "text", label: "Title", required: true },
    {
      type: "tabs",
      tabs: [
        {
          label: "Overview",
          fields: [
            { name: "summary", type: "textarea", label: "Summary", required: true, admin: { description: "What the report covers, in two or three sentences." } },
            { name: "industry", type: "text", label: "Industry", admin: { placeholder: "F&B" } },
            imageField({ name: "cover", label: "Cover image", required: true, admin: { description: "Landscape, at least 1600 × 1000 px." } }),
          ],
        },
        {
          label: "Key findings",
          description: "Up to five headline numbers shown before the download.",
          fields: [
            {
              name: "findings",
              type: "array",
              label: "Findings",
              labels: { singular: "Finding", plural: "Findings" },
              maxRows: 5,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "stat", type: "text", label: "Number", required: true, admin: { placeholder: "63%" } },
                    { name: "label", type: "text", label: "What it means", required: true, admin: { placeholder: "of orders start on social" } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Download",
          fields: [
            {
              name: "file",
              type: "upload",
              label: "Report file (PDF)",
              relationTo: "media",
              filterOptions: { mimeType: { equals: "application/pdf" } },
              admin: { description: "Leave empty until the PDF is ready; the page then shows the teaser only." },
            },
          ],
        },
      ],
    },
    slugField("title"),
    {
      name: "gated",
      type: "checkbox",
      label: "Ask for name and email before download",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
    publishedAtField(),
  ],
};
