import type { CollectionConfig } from "payload";
import { admins, adminsField, hasRole, ROLES } from "@/payload/access";

const ROLE_HELP: Record<(typeof ROLES)[number], string> = {
  admin: "Admin",
  editor: "Editor",
  hr: "HR",
  sales: "Sales",
};

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "User", plural: "Users" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "roles", "updatedAt"],
    listSearchableFields: ["name", "email"],
    group: "Administration",
    description: "Team accounts. Only admins can add people or change roles.",
    // Everyone can still edit their own account from the avatar menu.
    hidden: ({ user }) => !hasRole(user, "admin"),
  },
  auth: true,
  access: {
    // Admins see everyone; other roles only their own account.
    read: ({ req }) => (hasRole(req.user, "admin") ? true : req.user ? { id: { equals: req.user.id } } : false),
    create: admins,
    delete: admins,
    update: ({ req }) => (hasRole(req.user, "admin") ? true : req.user ? { id: { equals: req.user.id } } : false),
  },
  hooks: {
    beforeChange: [
      // The very first account (created at /admin/create-first-user) is the admin.
      async ({ req, operation, data }) => {
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
          if (totalDocs === 0) data.roles = ["admin"];
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", label: "Full name" },
    {
      name: "roles",
      type: "select",
      label: "Role",
      hasMany: true,
      defaultValue: ["editor"],
      options: ROLES.map((r) => ({ label: ROLE_HELP[r], value: r })),
      saveToJWT: true,
      access: { update: adminsField, create: adminsField },
      admin: {
        description:
          "Admin: everything, including users. Editor: website content and media. HR: jobs and applications. Sales: leads.",
      },
    },
  ],
};
