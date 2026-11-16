import type { CollectionBeforeChangeHook, Field, FieldHook, UploadField } from "payload";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** URL slug, filled from `from` when left empty. */
export const slugField = (from: string, label = from): Field => ({
  name: "slug",
  type: "text",
  label: "URL slug",
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: `The last part of the page address. Leave empty to create it from the ${label}. Changing it breaks links that were already shared.`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => (typeof value === "string" && value ? slugify(value) : slugify(String(data?.[from] ?? ""))),
    ],
  },
});

/** Publish date in the sidebar; filled in automatically on first publish. */
export const publishedAtField = (description = "Shown on the page and used for sorting. Filled in automatically when you first publish."): Field => ({
  name: "publishedAt",
  type: "date",
  label: "Publish date",
  admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" }, description },
});

/** Sets publishedAt the first time a document is published, so lists sort sensibly. */
export const stampPublishedAt: CollectionBeforeChangeHook = ({ data }) => {
  if (data?._status === "published" && !data.publishedAt) data.publishedAt = new Date().toISOString();
  return data;
};

/** An image picked from (or uploaded to) the Media library. */
export const imageField = (props: Omit<UploadField, "type" | "relationTo" | "filterOptions">): UploadField =>
  ({
    ...props,
    type: "upload",
    relationTo: "media",
    filterOptions: { mimeType: { contains: "image" } },
  }) as UploadField;

type Tone = "success" | "warning" | "error" | "light" | "light-gray" | "dark";

/** Shows a select field as coloured pills in list views (see StatusCell). */
export const statusCell = (tones: Record<string, Tone>) => ({
  Cell: { path: "/components/admin/StatusCell#StatusCell", clientProps: { tones } },
});

/**
 * Draft/publish shared by every collection that has drafts: explicit
 * "Save draft" and "Publish" buttons. No autosave: with it, merely opening
 * "Create new" stores an empty draft, which piles up "Untitled" entries.
 * Payload still warns before leaving a page with unsaved changes.
 */
export const draftVersions = {
  drafts: true,
  maxPerDoc: 30,
} as const;

const isEmpty = (value: unknown) => value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);

/**
 * afterRead: an empty value reads as the built-in text, so the edit form
 * starts from what the website shows today and the site never renders a
 * blank heading. Saving writes the (edited) text to the database.
 */
export const orDefault =
  (fallback: unknown): FieldHook =>
  ({ value }) =>
    isEmpty(value) ? structuredClone(fallback) : value;

/** A section text with a built-in default (see orDefault). */
export const copyField = (name: string, label: string, fallback: string, opts: { long?: boolean; description?: string } = {}): Field => {
  const base = { name, label, hooks: { afterRead: [orDefault(fallback)] }, admin: { description: opts.description } };
  return opts.long || fallback.includes("\n") ? { ...base, type: "textarea" } : { ...base, type: "text" };
};

/** A button in the form that opens another part of the CMS (components/admin/ManageLink). */
export const manageLink = (name: string, href: string, label: string, text: string): Field => ({
  name,
  type: "ui",
  admin: { components: { Field: { path: "/components/admin/ManageLink#ManageLink", clientProps: { href, label, text } } } },
});
