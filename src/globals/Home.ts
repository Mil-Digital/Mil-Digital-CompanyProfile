import type { GlobalConfig } from "payload";
import { anyone, editors } from "@/payload/access";
import { revalidateGlobal } from "@/payload/revalidate";
import { copyField, manageLink, orDefault } from "@/payload/fields";
import { HOME_COPY as C } from "@/content/home-copy";

/**
 * Homepage settings: one tab per section, in the order they appear on the
 * page, so the live preview and the form read the same way top to bottom.
 * Section texts start from the built-in copy (src/content/home-copy.ts).
 * Lists that live in their own collections (client logos, testimonials,
 * articles) are edited there; their tabs link to them.
 * Linked from the top of the admin menu (Website → Homepage) by
 * components/admin/WebsiteNav, so it is left out of the grouped menu.
 */
export const Home: GlobalConfig = {
  slug: "home",
  label: "Homepage",
  admin: {
    group: false,
    description:
      "Tabs follow the page from top to bottom. Click “Edit” on any section in the preview to jump to its tab. Changes go live as soon as you press Save.",
  },
  access: { read: anyone, update: editors },
  hooks: revalidateGlobal("home"),
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          name: "hero",
          description: "The first screen of the website.",
          fields: [
            { name: "eyebrow", type: "text", label: "Small label", required: true, admin: { placeholder: "Digital Marketing Consultant · Bandung" } },
            {
              name: "title",
              type: "textarea",
              label: "Headline",
              required: true,
              admin: {
                description: "The last word is set huge behind the people (e.g. “growth.”); the rest sits above it. Keep it to one sentence.",
              },
            },
            { name: "body", type: "textarea", label: "Supporting text", required: true, admin: { description: "Two sentences under the buttons." } },
            {
              name: "backgroundImage",
              label: "Background image",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image" } },
              admin: {
                description:
                  "Used together with the cut-out below. While the cut-out is empty, the homepage shows the built-in MIL studio illustration instead.",
              },
            },
            {
              name: "foregroundImage",
              label: "Cut-out of the same image",
              type: "upload",
              relationTo: "media",
              // Only formats that can be transparent: a JPEG would cover the big word.
              filterOptions: { mimeType: { in: ["image/png", "image/webp", "image/avif"] } },
              admin: {
                description:
                  "Optional. The background image again, same size, with everything except the people removed (transparent PNG or WebP; a JPEG would hide the big word). Leave both images empty to use the built-in MIL studio illustration.",
              },
            },
          ],
        },
        {
          label: "Journey film",
          name: "showreel",
          description: "Optional video that plays behind the hero once the page has loaded.",
          fields: [
            {
              name: "video",
              type: "upload",
              label: "Film",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "video" } },
              admin: { description: "MP4, muted, a few seconds that loop, under 20 MB. Leave empty to keep the image." },
            },
            // Not shown on the current homepage; kept hidden so saved values are not lost.
            { name: "title", type: "text", required: true, admin: { hidden: true } },
            { name: "caption", type: "text", admin: { hidden: true } },
            {
              name: "poster",
              type: "upload",
              relationTo: "media",
              required: true,
              filterOptions: { mimeType: { contains: "image" } },
              admin: { hidden: true },
            },
            {
              name: "milestones",
              type: "array",
              minRows: 2,
              maxRows: 8,
              admin: { hidden: true },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "year", type: "text", required: true, admin: { width: "25%" } },
                    { name: "label", type: "text", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "About",
          name: "about",
          description: "“About MIL Digital”, right under the hero. The statement fills in as visitors scroll.",
          fields: [
            copyField("label", "Small label", C.about.label),
            copyField("statement", "Statement", C.about.statement, { long: true, description: "Two or three sentences. Keep it short; it is set very large." }),
            copyField("linkLabel", "Link text", C.about.linkLabel, { description: "Opens the About MIL Digital page." }),
            {
              name: "pillars",
              type: "array",
              label: "What the logo stands for",
              labels: { singular: "Pillar", plural: "Pillars" },
              minRows: 3,
              maxRows: 3,
              hooks: { afterRead: [orDefault(C.about.pillars)] },
              admin: { description: "The three shapes of the MIL mark, under the logo." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "title", type: "text", label: "Title", required: true, admin: { width: "30%" } },
                    { name: "body", type: "text", label: "Line", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Clients",
          fields: [
            {
              name: "clientStrip",
              type: "group",
              label: false,
              admin: { description: "The moving logo strip." },
              fields: [copyField("title", "Heading", C.clients.title)],
            },
            manageLink("manageClients", "/collections/clients", "Edit client logos", "Add, hide or reorder the logos in Portfolio → Clients."),
          ],
        },
        {
          label: "Selected works",
          fields: [
            {
              name: "work",
              type: "group",
              label: false,
              admin: { description: "The case study carousel." },
              fields: [
                {
                  type: "row",
                  fields: [copyField("label", "Small label", C.work.label), copyField("title", "Heading", C.work.title)],
                },
              ],
            },
            {
              name: "featuredCaseStudies",
              type: "relationship",
              label: "Featured case studies",
              relationTo: "case-studies",
              hasMany: true,
              maxRows: 8,
              admin: {
                description:
                  "The carousel and the case card in the hero, in this order. Drag to reorder. Only published ones show; leave empty to show the latest.",
              },
            },
            manageLink("manageCases", "/collections/case-studies", "Edit case studies", "Write or update the case studies themselves in Portfolio → Case studies."),
          ],
        },
        {
          label: "Services",
          name: "services",
          description: "The introduction above the three service panels.",
          fields: [
            copyField("title", "Heading", C.services.title),
            copyField("intro", "Introduction", C.services.intro, { long: true }),
          ],
        },
        {
          label: "Why MIL",
          name: "why",
          description: "“Why MIL Digital” and the A.C.T.I.V.E. promises.",
          fields: [
            {
              type: "row",
              fields: [copyField("label", "Small label", C.why.label), copyField("title", "Heading", C.why.title)],
            },
            copyField("intro", "Introduction", C.why.intro, { long: true }),
            copyField("certCaption", "Certification caption", C.why.certCaption, { description: "Next to the Meta badges." }),
            {
              name: "values",
              type: "array",
              label: "Promises",
              labels: { singular: "Promise", plural: "Promises" },
              minRows: 1,
              maxRows: 8,
              hooks: { afterRead: [orDefault(C.why.values)] },
              admin: { description: "Each one lights up as visitors scroll past it. Drag to reorder." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "mark", type: "text", label: "Letter", required: true, maxLength: 3, admin: { width: "15%" } },
                    { name: "title", type: "text", label: "Title", required: true },
                  ],
                },
                { name: "body", type: "textarea", label: "Line", required: true },
              ],
            },
          ],
        },
        {
          label: "Numbers",
          description: "“MIL in numbers”: the figures that light up while the photo wheel turns.",
          fields: [
            {
              name: "stats",
              type: "array",
              label: "Figures",
              labels: { singular: "Figure", plural: "Figures" },
              maxRows: 4,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "prefix", type: "text", label: "Before", admin: { width: "15%", placeholder: "Rp" } },
                    { name: "value", type: "number", label: "Number", required: true, admin: { width: "20%", placeholder: "150" } },
                    { name: "decimals", type: "number", label: "Decimals", defaultValue: 0, min: 0, max: 2, admin: { width: "15%" } },
                    { name: "suffix", type: "text", label: "After", admin: { width: "15%", placeholder: "+" } },
                  ],
                },
                { name: "label", type: "text", label: "Label", required: true, admin: { placeholder: "Brands partnered" } },
                { name: "note", type: "text", label: "Small print", admin: { placeholder: "Retail, F&B, beauty and more" } },
              ],
            },
            {
              name: "gallery",
              type: "upload",
              label: "Photo wheel",
              relationTo: "media",
              hasMany: true,
              filterOptions: { mimeType: { contains: "image" } },
              admin: { description: "Photos that turn behind the figures (team photos and case covers are added automatically). Also used on the Creative Solution page." },
            },
          ],
        },
        {
          label: "Team",
          name: "team",
          description: "“The people behind the numbers”.",
          fields: [
            copyField("label", "Small label", C.team.label),
            copyField("title", "Heading", C.team.title),
            copyField("intro", "Introduction", C.team.intro, { long: true }),
          ],
        },
        {
          label: "Testimonials",
          fields: [
            {
              name: "testimonialsSection",
              type: "group",
              label: false,
              admin: { description: "Client quotes." },
              fields: [copyField("label", "Small label", C.testimonials.label)],
            },
            manageLink("manageTestimonials", "/collections/testimonials", "Edit testimonials", "Add, hide or reorder the quotes in Portfolio → Testimonials."),
          ],
        },
        {
          label: "Insights",
          fields: [
            {
              name: "insightsSection",
              type: "group",
              label: false,
              admin: { description: "“Insights & reports”: the featured report plus the latest articles." },
              fields: [
                {
                  type: "row",
                  fields: [copyField("label", "Small label", C.insights.label), copyField("title", "Heading", C.insights.title)],
                },
              ],
            },
            {
              name: "featuredReport",
              type: "relationship",
              label: "Featured report",
              relationTo: "reports",
              admin: { description: "Shown first. The latest published articles are added automatically." },
            },
            manageLink("manageArticles", "/collections/articles", "Edit articles", "Write and publish articles in Insights → Articles."),
          ],
        },
        {
          label: "Contact",
          name: "contact",
          description: "The contact section with the brief form at the bottom of the page.",
          fields: [
            copyField("label", "Small label", C.contact.label),
            copyField("title", "Heading", C.contact.title),
            copyField("intro", "Introduction", C.contact.intro, { long: true }),
          ],
        },
      ],
    },
  ],
};
