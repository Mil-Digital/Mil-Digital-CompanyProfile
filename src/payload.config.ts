import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Clients } from "./collections/Clients";
import { CaseStudies } from "./collections/CaseStudies";
import { Articles, Reports, Testimonials } from "./collections/Content";
import { Leads } from "./collections/Leads";
import { JobApplications, Jobs } from "./collections/Careers";
import { Home } from "./globals/Home";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Payload CMS, served at /admin (PROJECT_SPEC §8). */
export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " · MIL Digital CMS" },
    dateFormat: "d MMM yyyy, HH:mm",
    // Always the light MIL theme (custom.scss); no dark-mode toggle.
    theme: "light",
    components: {
      // Live preview: fits the desktop page into the pane, and opens the form tab for a section clicked in the preview.
      providers: ["/components/admin/PreviewBridge#PreviewBridge"],
      graphics: {
        Logo: "/components/admin/Graphics#Logo",
        Icon: "/components/admin/Graphics#Icon",
      },
      // Brand block, then Website → Homepage at the top of the menu
      // (globals are otherwise listed last).
      beforeNavLinks: ["/components/admin/NavBrand#NavBrand", "/components/admin/WebsiteNav#WebsiteNav"],
      beforeDashboard: ["/components/admin/Dashboard#Dashboard"],
    },
    // Split-screen preview next to the edit form: the real page, updating
    // as the editor types (routes in src/app/(frontend)/preview).
    livePreview: {
      collections: ["case-studies", "articles", "reports", "jobs", "testimonials", "clients"],
      globals: ["home"],
      openByDefault: true,
      // Unsaved documents have no id yet; the preview appears after the first save.
      url: ({ data, collectionConfig, globalConfig }) =>
        globalConfig?.slug === "home" ? "/preview/home" : collectionConfig && data?.id ? `/preview/${collectionConfig.slug}/${data.id}` : null,
      // "Responsive" (the default) shows the full desktop page scaled to the pane.
      breakpoints: [
        { label: "Tablet", name: "tablet", width: 834, height: 1112 },
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
      ],
    },
  },
  // Menu order: Website (above), Portfolio, Insights, Careers, Leads, Library, Administration.
  collections: [CaseStudies, Clients, Testimonials, Articles, Reports, Jobs, JobApplications, Leads, Media, Users],
  globals: [Home],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    // pg already treats sslmode=require as verify-full; say so explicitly to
    // keep its deprecation warning out of the logs.
    pool: { connectionString: (process.env.DATABASE_URL || "").replace("sslmode=require", "sslmode=verify-full") },
  }),
  plugins: [
    // Vercel's disk is ephemeral, so uploads go to Vercel Blob once its token
    // is set (Vercel → Storage → Blob). Without it, files stay in ./media.
    // clientUploads sends files straight from the browser, past Vercel's
    // 4.5 MB request limit, so the journey film can be uploaded too.
    // alwaysInsertFields keeps the media table identical with or without the
    // token, since production never pushes schema changes.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      alwaysInsertFields: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
  sharp,
});
