import type { CollectionConfig } from "payload";
import { admins, anyone, hrTeam, hiddenUnless } from "@/payload/access";
import { revalidateCollection } from "@/payload/revalidate";
import { slugField, statusCell } from "@/payload/fields";

/** Open roles on /career. */
export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Job", plural: "Jobs" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "department", "location", "status", "updatedAt"],
    listSearchableFields: ["title", "department", "location"],
    group: "Careers",
    hidden: hiddenUnless("admin", "hr"),
    description: "Roles on the Career page. Set a role to Closed to take it off the site without losing it.",
  },
  defaultSort: "order",
  access: { read: anyone, create: hrTeam, update: hrTeam, delete: hrTeam },
  hooks: revalidateCollection("jobs"),
  fields: [
    { name: "title", type: "text", label: "Job title", required: true, admin: { placeholder: "Performance Marketing Specialist" } },
    {
      type: "row",
      fields: [
        { name: "department", type: "text", label: "Team", required: true, admin: { placeholder: "Advertising" } },
        { name: "location", type: "text", label: "Location", defaultValue: "Bandung" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "employmentType",
          type: "select",
          label: "Employment type",
          defaultValue: "full-time",
          options: [
            { label: "Full-time", value: "full-time" },
            { label: "Contract", value: "contract" },
            { label: "Internship", value: "internship" },
          ],
        },
        {
          name: "workMode",
          type: "select",
          label: "Work mode",
          defaultValue: "onsite",
          options: [
            { label: "On-site", value: "onsite" },
            { label: "Hybrid", value: "hybrid" },
            { label: "Remote", value: "remote" },
          ],
        },
      ],
    },
    { name: "summary", type: "textarea", label: "Short description", required: true, admin: { description: "One or two lines shown in the list of roles." } },
    {
      name: "responsibilities",
      type: "array",
      label: "What you'll do",
      labels: { singular: "Responsibility", plural: "Responsibilities" },
      fields: [{ name: "item", type: "text", label: "Responsibility", required: true }],
    },
    {
      name: "requirements",
      type: "array",
      label: "What we're looking for",
      labels: { singular: "Requirement", plural: "Requirements" },
      fields: [{ name: "item", type: "text", label: "Requirement", required: true }],
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      defaultValue: "open",
      options: [
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
      ],
      admin: {
        position: "sidebar",
        description: "Only open roles appear on the website.",
        components: statusCell({ open: "success", closed: "light-gray" }),
      },
    },
    slugField("title", "job title"),
    { name: "order", type: "number", label: "Display order", defaultValue: 100, admin: { position: "sidebar", description: "Lower numbers come first." } },
  ],
};

/** Applications from the /career form. Only HR and admins can read them. */
export const JobApplications: CollectionConfig = {
  slug: "job-applications",
  labels: { singular: "Application", plural: "Applications" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "job", "status", "createdAt"],
    listSearchableFields: ["name", "email"],
    group: "Careers",
    description: "Sent from the Career page. The candidate's details are locked; use the status and notes to track the process.",
  },
  defaultSort: "-createdAt",
  access: { create: () => false, read: hrTeam, update: hrTeam, delete: admins },
  fields: [
    { name: "job", type: "relationship", label: "Applied for", relationTo: "jobs", admin: { description: "Empty when they applied without picking a role." } },
    {
      type: "collapsible",
      label: "Candidate",
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", label: "Name", required: true, admin: { readOnly: true } },
            { name: "email", type: "email", label: "Email", required: true, admin: { readOnly: true } },
            { name: "phone", type: "text", label: "Phone", admin: { readOnly: true } },
          ],
        },
        { name: "portfolio", type: "text", label: "CV / portfolio link", required: true, admin: { readOnly: true } },
        { name: "message", type: "textarea", label: "Message", admin: { readOnly: true } },
      ],
    },
    {
      name: "status",
      type: "select",
      label: "Stage",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Reviewing", value: "reviewing" },
        { label: "Interview", value: "interview" },
        { label: "Offer", value: "offer" },
        { label: "Rejected", value: "rejected" },
      ],
      admin: {
        position: "sidebar",
        description: "New → Reviewing → Interview → Offer, or Rejected.",
        components: statusCell({ new: "warning", reviewing: "light", interview: "dark", offer: "success", rejected: "light-gray" }),
      },
    },
    { name: "notes", type: "textarea", label: "Internal notes", admin: { position: "sidebar", description: "Only HR and admins see this." } },
  ],
};
