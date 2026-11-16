import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { buildHome, toArticle, toCase, toJob, toReport, type HomeData, type HomeLists } from "@/lib/cms-map";

export type { ArticleFull, CaseStudyFull, HomeData, Job, ReportFull } from "@/lib/cms-map";

/* ── CMS data layer ──────────────────────────────────────────────
 * Reads Payload through its Local API (no HTTP hop); src/lib/cms-map.ts
 * shapes the result for the section components. Cached with `use cache`
 * and tagged per collection; the CMS expires the tag on every save
 * (src/payload/revalidate.ts), so edits show on the next page load.
 * Anything missing in the CMS falls back to src/content/home.ts.
 * ─────────────────────────────────────────────────────────────── */

/** The collections the homepage lists next to the Home global (published only). */
export async function getHomeLists(): Promise<HomeLists> {
  "use cache";
  cacheTag("home");
  cacheLife("max");
  const payload = await getPayload({ config });
  const [clients, testimonials, articles, latestCases] = await Promise.all([
    payload.find({ collection: "clients", sort: "order", limit: 200, depth: 1 }),
    payload.find({ collection: "testimonials", sort: "order", limit: 50 }),
    payload.find({ collection: "articles", where: { _status: { equals: "published" } }, sort: "-publishedAt", limit: 5, depth: 1 }),
    // Stands in when no featured case studies are picked.
    payload.find({ collection: "case-studies", where: { _status: { equals: "published" } }, sort: "-publishedAt", limit: 6, depth: 1 }),
  ]);
  return { clients: clients.docs, testimonials: testimonials.docs, articles: articles.docs, latestCases: latestCases.docs };
}

export async function getHomeData(): Promise<HomeData> {
  "use cache";
  cacheTag("home");
  cacheLife("max");
  const payload = await getPayload({ config });
  const [home, lists] = await Promise.all([payload.findGlobal({ slug: "home", depth: 2 }), getHomeLists()]);
  return buildHome(home, lists);
}

/* ── Inner pages ─────────────────────────────────────────────── */

export async function getCaseStudies() {
  "use cache";
  cacheTag("case-studies");
  cacheLife("max");
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "case-studies",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 100,
    depth: 1,
  });
  return res.docs.map(toCase);
}

export async function getCaseStudy(slug: string) {
  const all = await getCaseStudies();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getArticles() {
  "use cache";
  cacheTag("articles");
  cacheLife("max");
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "articles",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 100,
    depth: 1,
  });
  return res.docs.map(toArticle);
}

export async function getArticle(slug: string) {
  const all = await getArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function getReports() {
  "use cache";
  cacheTag("reports");
  cacheLife("max");
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "reports",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 100,
    depth: 1,
  });
  return res.docs.map(toReport);
}

export async function getReport(slug: string) {
  const all = await getReports();
  return all.find((r) => r.slug === slug) ?? null;
}

export async function getJobs() {
  "use cache";
  cacheTag("jobs");
  cacheLife("max");
  const payload = await getPayload({ config });
  const res = await payload.find({ collection: "jobs", where: { status: { equals: "open" } }, sort: "order", limit: 50 });
  return res.docs.map(toJob);
}
