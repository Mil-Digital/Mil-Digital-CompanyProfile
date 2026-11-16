import type { CollectionConfig } from "payload";
import { editors, publishedOrSignedIn, hiddenUnless } from "@/payload/access";
import { revalidateCollection } from "@/payload/revalidate";
import { draftVersions, imageField, publishedAtField, slugField, stampPublishedAt } from "@/payload/fields";

/** Case studies: Our Works, the service pages and the homepage carousel. */
export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case study", plural: "Case studies" },
  admin: {
    useAsTitle: "client",
    defaultColumns: ["client", "title", "industry", "services", "_status", "publishedAt"],
    listSearchableFields: ["client", "title", "industry"],
    group: "Portfolio",
    hidden: hiddenUnless("admin", "editor"),
    description:
      "Published case studies appear on Our Works and the matching service pages. To show one on the homepage, add it in Website → Homepage → Featured.",
  },
  defaultSort: "-publishedAt",
  versions: draftVersions,
  access: { read: publishedOrSignedIn, create: editors, update: editors, delete: editors },
  hooks: { ...revalidateCollection("home", "case-studies"), beforeChange: [stampPublishedAt] },
  fields: [
    {
      type: "row",
      fields: [
        { name: "client", type: "text", label: "Client", required: true, admin: { width: "40%", description: "The brand name, e.g. Kopi Senja." } },
        { name: "title", type: "text", label: "Headline", required: true, admin: { width: "60%", description: "One line on what MIL achieved." } },
      ],
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Overview",
          description: "Used on cards, filters and the top of the case study.",
          fields: [
            {
              type: "row",
              fields: [
                { name: "industry", type: "text", label: "Industry", required: true, admin: { description: "e.g. F&B, Beauty, Retail. Use the same spelling as other case studies so filters group them." } },
                {
                  name: "scale",
                  type: "select",
                  label: "Business size",
                  options: ["SME", "Mid-market", "Enterprise"].map((v) => ({ label: v, value: v.toLowerCase() })),
                },
              ],
            },
            {
              name: "services",
              type: "select",
              label: "Services delivered",
              hasMany: true,
              required: true,
              admin: { description: "Decides which service pages show this case study." },
              options: [
                { label: "Consulting", value: "Consulting" },
                { label: "Advertising", value: "Advertising" },
                { label: "Creative", value: "Creative" },
              ],
            },
            {
              name: "metric",
              type: "group",
              label: "Headline result",
              admin: { description: "The one number on the card, e.g. 4.8x · ROAS in 90 days." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "value", type: "text", label: "Number", required: true, admin: { placeholder: "4.8x" } },
                    { name: "label", type: "text", label: "What it measures", required: true, admin: { placeholder: "ROAS in 90 days" } },
                  ],
                },
              ],
            },
            { name: "summary", type: "textarea", label: "Short summary", admin: { description: "One or two sentences, shown under the headline." } },
          ],
        },
        {
          label: "Story",
          fields: [
            {
              name: "body",
              type: "richText",
              label: "Full story",
              admin: { description: "Challenge, approach and results. Start each part with a heading." },
            },
          ],
        },
        {
          label: "Images",
          fields: [
            imageField({
              name: "cover",
              label: "Cover image",
              required: true,
              admin: { description: "Landscape, at least 1600 × 1000 px. Shown on cards and as the page header." },
            }),
          ],
        },
      ],
    },
    slugField("client", "client name"),
    publishedAtField(),
    {
      // Not read by the website: the homepage list lives in Website → Homepage.
      // Kept (hidden) so existing values are not lost.
      name: "featured",
      type: "checkbox",
      admin: { hidden: true },
    },
  ],
};
