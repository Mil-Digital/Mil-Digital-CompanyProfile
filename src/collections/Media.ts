import type { CollectionConfig } from "payload";
import { anyone, editors, hiddenUnless } from "@/payload/access";
import { revalidateCollection } from "@/payload/revalidate";

/**
 * Every uploaded file: photos, logos, the journey film, report PDFs.
 * Images carry a focal point (click the spot that must stay in frame),
 * which the site uses when it crops, e.g. the hero background.
 *
 * Files go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set (see
 * payload.config.ts), otherwise to local disk (./media) in development.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "File", plural: "Media" },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "mimeType", "filesize", "updatedAt"],
    listSearchableFields: ["alt", "filename"],
    group: "Library",
    hidden: hiddenUnless("admin", "editor"),
    description:
      "Photos, logos, videos and report PDFs. Everything here is public on the website, so don't upload private documents. Replacing a file updates it everywhere it is used.",
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: revalidateCollection("home", "case-studies", "articles", "reports"),
  upload: {
    focalPoint: true,
    displayPreview: true,
    mimeTypes: ["image/*", "video/*", "application/pdf"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Description (alt text)",
      required: true,
      admin: {
        description:
          "What the file shows, e.g. “MIL team in a strategy session”. Read aloud by screen readers, used by search engines, and makes the file easy to find here.",
      },
    },
  ],
};
