import type {
  Article as ArticleDoc,
  CaseStudy as CaseStudyDoc,
  Client as ClientDoc,
  Home as HomeDoc,
  Job as JobDoc,
  Media,
  Report as ReportDoc,
  Testimonial as TestimonialDoc,
} from "@/payload-types";
import * as fallback from "@/content/home";
import type { CaseStudy, Client, Stat } from "@/content/home";
import { HOME_COPY as C, type HomeCopy } from "@/content/home-copy";

/* ── CMS document → page data ────────────────────────────────────
 * Pure functions that turn Payload documents into what the section
 * components render. Shared by the cached site queries (src/lib/cms.ts)
 * and the CMS live preview (src/components/preview), so the preview is
 * exactly the page. Inputs can be half-filled while an editor is typing,
 * so nothing here assumes a required field is set.
 * ─────────────────────────────────────────────────────────────── */

export type HomeData = {
  /** Section texts (Website → Homepage), with the built-in copy as fallback. */
  copy: HomeCopy;
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    background: { image: string; focal: string } | null;
    /** The background photo with its background removed, for the depth effect. */
    foreground: string | null;
    /** The journey film, if uploaded: plays over the hero photo. */
    video: string | null;
  };
  showreel: { title: string; caption: string; video: string | null; poster: string; milestones: { year: string; label: string }[] };
  stats: Stat[];
  clients: Client[];
  caseStudies: CaseStudy[];
  gallery: { src: string; alt: string }[];
  testimonials: { quote: string; name: string; role: string; company: string }[];
  insights: {
    articles: { slug: string; category: string; title: string; excerpt: string; readingTime: string; image: string }[];
    report: {
      slug: string;
      title: string;
      summary: string;
      image: string;
      findings: { stat: string; label: string }[];
    } | null;
  };
};

/** The collections the homepage lists next to the Home global. */
export type HomeLists = {
  clients: ClientDoc[];
  testimonials: TestimonialDoc[];
  articles: ArticleDoc[];
  latestCases: CaseStudyDoc[];
};

/**
 * Payload prefixes upload URLs with `serverURL`. Keep only the path so the
 * same content works on any host (localhost, preview, mildigital.id) and
 * next/image treats it as a local image.
 */
const relative = (u: string) => (/^https?:\/\//.test(u) ? new URL(u).pathname : u);

/** A populated upload field (URL made relative), or null when unset. */
export function file(value: unknown): Media | null {
  if (!value || typeof value !== "object" || !("url" in value)) return null;
  const m = value as Media;
  return m.url ? { ...m, url: relative(m.url) } : m;
}
export const url = (value: unknown, fallbackUrl = "") => file(value)?.url ?? fallbackUrl;
const focal = (m: Media | null) => `${m?.focalX ?? 50}% ${m?.focalY ?? 50}%`;
const slugOf = (doc: { slug?: string | null; id?: number | string }) => doc.slug || String(doc.id ?? "");
const populated = <T,>(value: number | T | null | undefined): value is T => Boolean(value) && typeof value === "object";

// Featured items can point at drafts; only published ones reach the page.
const published = (doc: { _status?: string | null }) => doc._status !== "draft";

export const toCaseCard = (c: CaseStudyDoc): CaseStudy => ({
  slug: slugOf(c),
  client: c.client ?? "",
  title: c.title ?? "",
  industry: c.industry ?? "",
  services: c.services ?? [],
  metric: { value: c.metric?.value ?? "", label: c.metric?.label ?? "" },
  image: url(c.cover),
});

export const toClient = (c: ClientDoc): Client => ({ name: c.name ?? "", logo: url(c.logo) });

export const toTestimonial = (t: TestimonialDoc): HomeData["testimonials"][number] => ({
  quote: t.quote ?? "",
  name: t.name ?? "",
  role: t.role ?? "",
  company: t.company ?? "",
});

const or = (value: string | null | undefined, fallback: string) => value || fallback;

function buildCopy(home: HomeDoc): HomeCopy {
  const { about, clientStrip, work, services, why, team, testimonialsSection, insightsSection, contact } = home;
  return {
    about: {
      label: or(about?.label, C.about.label),
      statement: or(about?.statement, C.about.statement),
      linkLabel: or(about?.linkLabel, C.about.linkLabel),
      pillars: about?.pillars?.length ? about.pillars.map((p) => ({ title: p.title ?? "", body: p.body ?? "" })) : C.about.pillars,
    },
    clients: { title: or(clientStrip?.title, C.clients.title) },
    work: { label: or(work?.label, C.work.label), title: or(work?.title, C.work.title) },
    services: { title: or(services?.title, C.services.title), intro: or(services?.intro, C.services.intro) },
    why: {
      label: or(why?.label, C.why.label),
      title: or(why?.title, C.why.title),
      intro: or(why?.intro, C.why.intro),
      certCaption: or(why?.certCaption, C.why.certCaption),
      values: why?.values?.length ? why.values.map((v) => ({ mark: v.mark ?? "", title: v.title ?? "", body: v.body ?? "" })) : C.why.values,
    },
    team: { label: or(team?.label, C.team.label), title: or(team?.title, C.team.title), intro: or(team?.intro, C.team.intro) },
    testimonials: { label: or(testimonialsSection?.label, C.testimonials.label) },
    insights: { label: or(insightsSection?.label, C.insights.label), title: or(insightsSection?.title, C.insights.title) },
    contact: { label: or(contact?.label, C.contact.label), title: or(contact?.title, C.contact.title), intro: or(contact?.intro, C.contact.intro) },
  };
}

export function buildHome(home: HomeDoc, lists: HomeLists): HomeData {
  const bg = file(home.hero?.backgroundImage);
  const fg = file(home.hero?.foregroundImage);
  const report = populated(home.featuredReport) && published(home.featuredReport) ? home.featuredReport : null;
  const featured = (home.featuredCaseStudies ?? []).filter(populated).filter(published);
  const caseStudies = featured.length ? featured : lists.latestCases;

  return {
    copy: buildCopy(home),
    hero: {
      eyebrow: home.hero?.eyebrow || fallback.hero.eyebrow,
      title: home.hero?.title || fallback.hero.title,
      body: home.hero?.body || fallback.hero.body,
      // The depth effect needs a matching pair: the CMS photo + its cut-out,
      // or, until a cut-out is uploaded, the built-in studio illustration.
      ...(fg?.url
        ? { background: bg?.url ? { image: bg.url, focal: focal(bg) } : null, foreground: fg.url }
        : { background: fallback.hero.background, foreground: fallback.hero.foreground }),
      video: file(home.showreel?.video)?.url ?? null,
    },
    showreel: {
      title: home.showreel?.title || fallback.showreel.title,
      caption: home.showreel?.caption || fallback.showreel.caption,
      video: file(home.showreel?.video)?.url ?? null,
      poster: url(home.showreel?.poster, fallback.showreel.poster),
      milestones: home.showreel?.milestones?.length
        ? home.showreel.milestones.map(({ year, label }) => ({ year: year ?? "", label: label ?? "" }))
        : fallback.milestones,
    },
    stats: home.stats?.length
      ? home.stats.map((s) => ({
          value: Number(s.value) || 0,
          decimals: s.decimals ?? 0,
          prefix: s.prefix ?? undefined,
          suffix: s.suffix ?? undefined,
          label: s.label ?? "",
          note: s.note ?? "",
        }))
      : fallback.stats,
    // Built-in content only stands in while a collection is empty; anything
    // an editor has hidden stays hidden.
    clients: lists.clients.length
      ? lists.clients
          .filter((c) => c.showInMarquee !== false)
          .map(toClient)
          .filter((c) => c.logo)
      : fallback.clients,
    caseStudies: caseStudies.length ? caseStudies.map(toCaseCard) : fallback.caseStudies,
    gallery: home.gallery?.length
      ? home.gallery
          .map(file)
          .filter((m): m is Media => Boolean(m?.url))
          .map((m) => ({ src: m.url!, alt: m.alt ?? "" }))
      : fallback.gallery,
    testimonials: lists.testimonials.length
      ? lists.testimonials
          .filter((t) => t.showOnWebsite !== false)
          .slice(0, 12)
          .map(toTestimonial)
      : fallback.testimonials,
    insights: {
      articles: lists.articles.length
        ? lists.articles.map((a) => ({
            slug: slugOf(a),
            category: a.category ?? "",
            title: a.title ?? "",
            excerpt: a.excerpt ?? "",
            readingTime: a.readingTime ?? "",
            image: url(a.cover),
          }))
        : fallback.insights.articles,
      report: report
        ? {
            slug: slugOf(report),
            title: report.title ?? "",
            summary: report.summary ?? "",
            image: url(report.cover),
            findings: (report.findings ?? []).map(({ stat, label }) => ({ stat: stat ?? "", label: label ?? "" })),
          }
        : null,
    },
  };
}

/* ── Inner pages ─────────────────────────────────────────────── */

export type CaseStudyFull = CaseStudy & {
  id: number;
  scale: string | null;
  summary: string;
  body: unknown | null;
  year: string | null;
};

export const toCase = (c: CaseStudyDoc): CaseStudyFull => ({
  ...toCaseCard(c),
  id: c.id,
  scale: c.scale ?? null,
  summary: c.summary ?? "",
  body: c.body ?? null,
  year: c.publishedAt ? String(new Date(c.publishedAt).getFullYear()) : null,
});

export type ArticleFull = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readingTime: string;
  image: string;
  author: { name: string; role: string } | null;
  publishedAt: string | null;
  content: unknown | null;
};

export const toArticle = (a: ArticleDoc): ArticleFull => ({
  slug: slugOf(a),
  category: a.category ?? "",
  title: a.title ?? "",
  excerpt: a.excerpt ?? "",
  readingTime: a.readingTime ?? "",
  image: url(a.cover),
  author: a.author?.name ? { name: a.author.name, role: a.author.role ?? "" } : null,
  publishedAt: a.publishedAt ?? null,
  content: a.content ?? null,
});

export type ReportFull = {
  slug: string;
  title: string;
  industry: string;
  summary: string;
  image: string;
  findings: { stat: string; label: string }[];
  gated: boolean;
  /** Only set for ungated reports; gated ones are released by the form. */
  fileUrl: string | null;
  hasFile: boolean;
  publishedAt: string | null;
};

export const toReport = (r: ReportDoc): ReportFull => {
  const f = file(r.file);
  const gated = r.gated ?? true;
  return {
    slug: slugOf(r),
    title: r.title ?? "",
    industry: r.industry ?? "",
    summary: r.summary ?? "",
    image: url(r.cover),
    findings: (r.findings ?? []).map(({ stat, label }) => ({ stat: stat ?? "", label: label ?? "" })),
    gated,
    fileUrl: !gated && f?.url ? f.url : null,
    hasFile: Boolean(f?.url),
    publishedAt: r.publishedAt ?? null,
  };
};

export type Job = {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  workMode: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const toJob = (j: JobDoc): Job => ({
  id: j.id,
  slug: slugOf(j),
  title: j.title ?? "",
  department: j.department ?? "",
  location: j.location || "Bandung",
  employmentType: j.employmentType ?? "full-time",
  workMode: j.workMode ?? "onsite",
  summary: j.summary ?? "",
  responsibilities: (j.responsibilities ?? []).map((r) => r.item ?? ""),
  requirements: (j.requirements ?? []).map((r) => r.item ?? ""),
});
