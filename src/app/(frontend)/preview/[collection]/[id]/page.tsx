import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles, getCaseStudies, getHomeLists, getJobs } from "@/lib/cms";
import { toClient, toTestimonial } from "@/lib/cms-map";
import { PageSkeleton } from "@/components/page/blocks";
import { LiveArticle, LiveCaseStudy, LiveClient, LiveJob, LiveReport, LiveTestimonial } from "@/components/preview/live";
import { previewSession, SignedOut } from "@/components/preview/server";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

// Previews are per-request and never prerendered, so the shared layout may block on the URL.
export const instant = false;

type Params = PageProps<"/preview/[collection]/[id]">["params"];

/**
 * CMS live preview of one document, opened by the admin's preview pane
 * (admin.livePreview in src/payload.config.ts). Loads the latest draft
 * with the signed-in user's own access, then hands it to the live
 * component that re-renders as the editor types.
 */
async function DocumentPreview({ params }: { params: Params }) {
  const { collection, id } = await params;
  const session = await previewSession();
  if (!session) return <SignedOut />;
  const { payload, user } = session;
  const opts = { id, draft: true, depth: 1, overrideAccess: false, user, disableErrors: true } as const;

  switch (collection) {
    case "case-studies": {
      const [doc, others] = await Promise.all([payload.findByID({ collection, ...opts }), getCaseStudies()]);
      return doc ? <LiveCaseStudy initial={doc} others={others} /> : notFound();
    }
    case "articles": {
      const [doc, others] = await Promise.all([payload.findByID({ collection, ...opts }), getArticles()]);
      return doc ? <LiveArticle initial={doc} others={others} /> : notFound();
    }
    case "reports": {
      const doc = await payload.findByID({ collection, ...opts });
      return doc ? <LiveReport initial={doc} /> : notFound();
    }
    case "jobs": {
      const [doc, others] = await Promise.all([payload.findByID({ collection, ...opts }), getJobs()]);
      return doc ? <LiveJob initial={doc} others={others} /> : notFound();
    }
    case "testimonials": {
      const [doc, lists] = await Promise.all([payload.findByID({ collection, ...opts }), getHomeLists()]);
      const others = lists.testimonials.filter((t) => t.id !== doc?.id && t.showOnWebsite !== false).map(toTestimonial);
      return doc ? <LiveTestimonial initial={doc} others={others} /> : notFound();
    }
    case "clients": {
      const [doc, lists] = await Promise.all([payload.findByID({ collection, ...opts }), getHomeLists()]);
      const others = lists.clients
        .filter((c) => c.id !== doc?.id && c.showInMarquee !== false)
        .map(toClient)
        .filter((c) => c.logo);
      return doc ? <LiveClient initial={doc} others={others} /> : notFound();
    }
    default:
      notFound();
  }
}

export default function Page({ params }: PageProps<"/preview/[collection]/[id]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DocumentPreview params={params} />
    </Suspense>
  );
}
