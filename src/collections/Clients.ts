import type { CollectionConfig } from "payload";
import { anyone, editors, hiddenUnless } from "@/payload/access";
import { revalidateCollection } from "@/payload/revalidate";
import { imageField } from "@/payload/fields";

/** Brands MIL has worked with: the logo marquee on the homepage and About. */
export const Clients: CollectionConfig = {
  slug: "clients",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "logo", "showInMarquee", "order"],
    listSearchableFields: ["name"],
    group: "Portfolio",
    hidden: hiddenUnless("admin", "editor"),
    description: "Logos in “Trusted by 150+ brands”. Upload white logos on a transparent background (PNG or SVG); they sit on MIL blue.",
  },
  defaultSort: "order",
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: revalidateCollection("home"),
  fields: [
    { name: "name", type: "text", label: "Brand name", required: true },
    imageField({
      name: "logo",
      label: "Logo",
      required: true,
      admin: { description: "White on transparent, PNG or SVG, at least 400 px wide." },
    }),
    { name: "showInMarquee", type: "checkbox", label: "Show in the logo strip", defaultValue: true, admin: { position: "sidebar" } },
    { name: "order", type: "number", label: "Display order", defaultValue: 100, admin: { position: "sidebar", description: "Lower numbers come first." } },
  ],
};
