import type { CollectionConfig } from "payload";
import { admins, salesTeam } from "@/payload/access";
import { statusCell } from "@/payload/fields";

export const ACTIVITIES = ["Advertising", "Social Media", "Branding", "Influencer", "Others"] as const;
export const SERVICES = ["Consultation", "Advertising", "Creative", "Not sure yet"] as const;

/**
 * Enquiries from the site's forms. The contact form writes here through a
 * server action (src/app/(frontend)/actions.ts); nobody can create leads
 * through the public API. Fields follow MIL's free consultation form.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "brandName", "source", "status", "createdAt"],
    listSearchableFields: ["name", "email", "phone", "brandName"],
    group: "Leads",
    description:
      "Everyone who sent a brief, took the quiz, downloaded a report or joined the ATLAS waitlist. Move the status along as you follow up, and keep notes in the sidebar.",
  },
  defaultSort: "-createdAt",
  access: { create: () => false, read: salesTeam, update: salesTeam, delete: admins },
  fields: [
    {
      type: "collapsible",
      label: "Contact",
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", label: "Name", required: true },
            { name: "email", type: "email", label: "Email", required: true },
            { name: "phone", type: "text", label: "Phone / WhatsApp" },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Brand",
      fields: [
        {
          type: "row",
          fields: [
            { name: "brandName", type: "text", label: "Brand" },
            { name: "industry", type: "text", label: "Industry" },
            { name: "location", type: "text", label: "Location" },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "What they need",
      fields: [
        {
          name: "services",
          type: "select",
          hasMany: true,
          label: "Services needed",
          options: SERVICES.map((s) => ({ label: s, value: s })),
        },
        {
          type: "row",
          fields: [
            { name: "budget", type: "text", label: "Monthly ad budget" },
            {
              name: "activities",
              type: "select",
              hasMany: true,
              label: "Digital marketing tried",
              options: ACTIVITIES.map((a) => ({ label: a, value: a })),
            },
          ],
        },
        { name: "message", type: "textarea", label: "What they want to discuss" },
        {
          name: "quizAnswers",
          type: "textarea",
          label: "Brand quiz answers",
          admin: { description: "Filled in when the visitor took the brand quiz first.", condition: (data) => Boolean(data?.quizAnswers) },
        },
      ],
    },
    // Sidebar: the follow-up
    {
      name: "status",
      type: "select",
      label: "Follow-up status",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Qualified", value: "qualified" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
      ],
      admin: {
        position: "sidebar",
        description: "New → Contacted → Qualified → Won or Lost.",
        components: statusCell({ new: "warning", contacted: "light", qualified: "dark", won: "success", lost: "light-gray" }),
      },
    },
    { name: "notes", type: "textarea", label: "Internal notes", admin: { position: "sidebar", description: "Only the sales team sees this." } },
    {
      name: "source",
      type: "select",
      label: "Came from",
      defaultValue: "contact-form",
      options: [
        { label: "Contact form", value: "contact-form" },
        { label: "Brand quiz", value: "quiz" },
        { label: "Booking", value: "booking" },
        { label: "Report download", value: "report" },
        { label: "ATLAS waitlist", value: "atlas-waitlist" },
      ],
      admin: {
        position: "sidebar",
        components: statusCell({ "contact-form": "light", quiz: "light", booking: "light", report: "light", "atlas-waitlist": "light" }),
      },
    },
    { name: "reference", type: "text", label: "Report or offer", admin: { position: "sidebar", description: "e.g. the report they downloaded." } },
    { name: "pageOrigin", type: "text", label: "Sent from page", admin: { readOnly: true, position: "sidebar" } },
  ],
};
