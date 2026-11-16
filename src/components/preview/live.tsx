"use client";

import * as React from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";
import type {
  Article as ArticleDoc,
  CaseStudy as CaseStudyDoc,
  Client as ClientDoc,
  Home as HomeDoc,
  Job as JobDoc,
  Report as ReportDoc,
  Testimonial as TestimonialDoc,
} from "@/payload-types";
import {
  buildHome,
  toArticle,
  toCase,
  toClient,
  toJob,
  toReport,
  toTestimonial,
  type ArticleFull,
  type CaseStudyFull,
  type HomeLists,
  type Job,
} from "@/lib/cms-map";
import type { Client } from "@/content/home";
import type { HomeData } from "@/lib/cms-map";
import { HomeView } from "@/components/views/home-view";
import { CaseStudyView } from "@/components/views/case-study-view";
import { ArticleView } from "@/components/views/article-view";
import { ReportView } from "@/components/views/report-view";
import { CareerView } from "@/components/views/career-view";
import { Testimonials } from "@/components/sections/testimonials";
import { ClientMarquee } from "@/components/sections/client-marquee";
import { EditOverlay, type EditZones } from "@/components/preview/edit-overlay";

// Which form tab each previewed section is edited in (sections carry data-cms).
const HOME_ZONES: EditZones = {
  hero: { tab: "Hero" },
  about: { tab: "About" },
  clients: { tab: "Clients", label: "client logos" },
  work: { tab: "Selected works" },
  services: { tab: "Services" },
  why: { tab: "Why MIL" },
  numbers: { tab: "Numbers" },
  team: { tab: "Team" },
  testimonials: { tab: "Testimonials" },
  insights: { tab: "Insights" },
  contact: { tab: "Contact" },
};
const CASE_ZONES: EditZones = { overview: { tab: "Overview" }, story: { tab: "Story" } };
const ARTICLE_ZONES: EditZones = { card: { tab: "Card", label: "title & card" }, article: { tab: "Article", label: "article text" } };
const REPORT_ZONES: EditZones = { overview: { tab: "Overview" }, findings: { tab: "Key findings" }, download: { tab: "Download" } };

/* ── CMS live preview ─────────────────────────────────────────────
 * Rendered inside the Payload admin's preview pane. The admin posts the
 * form's values on every change; useLivePreview merges them (fetching
 * any newly picked image or relation) and the page re-renders with the
 * same components and mapping as the public site.
 * ─────────────────────────────────────────────────────────────── */

function useLive<T extends { id?: number | string }>(initialData: T, depth = 1) {
  // The admin and the site share one origin; the hook only uses this in effects.
  const serverURL = typeof window === "undefined" ? "" : window.location.origin;
  const { data, isLoading } = useLivePreview<T>({ initialData, serverURL, depth });
  return { data, connected: !isLoading };
}

/** A small floating tag so nobody mistakes the preview for the live site. */
function PreviewBadge({ connected, status, note }: { connected: boolean; status?: string | null; note?: string | null }) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[100] flex items-center gap-2 rounded-full bg-[#0b1d47]/85 px-3.5 py-2 text-[12px] font-medium text-white shadow-lg backdrop-blur">
      <span className={connected ? "size-2 animate-pulse rounded-full bg-emerald-400" : "size-2 rounded-full bg-white/40"} />
      {connected ? "Live preview" : "Preview"}
      {status ? (
        <span className={status === "draft" ? "rounded-full bg-[#faaf40] px-2 py-0.5 text-[#0b1d47]" : "rounded-full bg-white/15 px-2 py-0.5"}>
          {status === "draft" ? "Draft" : "Published"}
        </span>
      ) : null}
      {note ? <span className="rounded-full bg-[#faaf40] px-2 py-0.5 text-[#0b1d47]">{note}</span> : null}
    </div>
  );
}

export function LiveHome({ initial, lists }: { initial: HomeDoc; lists: HomeLists }) {
  const { data, connected } = useLive(initial, 2);
  return (
    <>
      <HomeView data={buildHome(data, lists)} />
      <EditOverlay zones={HOME_ZONES} />
      <PreviewBadge connected={connected} />
    </>
  );
}

export function LiveCaseStudy({ initial, others }: { initial: CaseStudyDoc; others: CaseStudyFull[] }) {
  const { data, connected } = useLive(initial);
  const c = toCase(data);
  const rest = others.filter((o) => o.id !== c.id);
  return (
    <>
      <CaseStudyView c={c} next={rest[0] ?? null} />
      <EditOverlay zones={CASE_ZONES} />
      <PreviewBadge connected={connected} status={data._status} />
    </>
  );
}

export function LiveArticle({ initial, others }: { initial: ArticleDoc; others: ArticleFull[] }) {
  const { data, connected } = useLive(initial);
  const a = toArticle(data);
  const rest = others.filter((o) => o.slug !== a.slug);
  const related = [...rest.filter((x) => x.category === a.category), ...rest.filter((x) => x.category !== a.category)].slice(0, 3);
  return (
    <>
      <ArticleView a={a} related={related} />
      <EditOverlay zones={ARTICLE_ZONES} />
      <PreviewBadge connected={connected} status={data._status} />
    </>
  );
}

export function LiveReport({ initial }: { initial: ReportDoc }) {
  const { data, connected } = useLive(initial);
  return (
    <>
      <ReportView r={toReport(data)} />
      <EditOverlay zones={REPORT_ZONES} />
      <PreviewBadge connected={connected} status={data._status} />
    </>
  );
}

export function LiveJob({ initial, others }: { initial: JobDoc; others: Job[] }) {
  const { data, connected } = useLive(initial);
  const job = toJob(data);
  // The edited role first, so it opens in the accordion; closed roles still show here.
  const jobs = [job, ...others.filter((o) => o.id !== job.id)];
  return (
    <>
      <CareerView jobs={jobs} />
      <PreviewBadge connected={connected} note={data.status === "closed" ? "Closed: hidden on the site" : null} />
    </>
  );
}

/** For records that only appear as part of a homepage section. */
function SectionFrame({ label, hidden, children }: { label: string; hidden?: boolean; children: React.ReactNode }) {
  return (
    <div className="min-h-svh pt-[var(--header-space,7rem)]">
      <div className="container-x pb-6 pt-6">
        <p className="t-label">Homepage · {label}</p>
        {hidden ? <p className="mt-2 text-[15px] text-[#faaf40]">Hidden on the website. Tick “Show” in the sidebar to show it.</p> : null}
      </div>
      {children}
    </div>
  );
}

export function LiveTestimonial({ initial, others }: { initial: TestimonialDoc; others: HomeData["testimonials"] }) {
  const { data, connected } = useLive(initial);
  return (
    <>
      <SectionFrame label="Testimonials" hidden={data.showOnWebsite === false}>
        <Testimonials testimonials={[toTestimonial(data), ...others]} />
      </SectionFrame>
      <PreviewBadge connected={connected} />
    </>
  );
}

export function LiveClient({ initial, others }: { initial: ClientDoc; others: Client[] }) {
  const { data, connected } = useLive(initial);
  const client = toClient(data);
  return (
    <>
      <SectionFrame label="Client logos" hidden={data.showInMarquee === false}>
        <ClientMarquee clients={client.logo ? [client, ...others] : others} />
      </SectionFrame>
      <PreviewBadge connected={connected} />
    </>
  );
}
