import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudies, getCaseStudy } from "@/lib/cms";
import { PageSkeleton } from "@/components/page/blocks";
import { CaseStudyView } from "@/components/views/case-study-view";

export async function generateStaticParams() {
  const cases = await getCaseStudies();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/our-works-case-study/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  return c ? { title: `${c.client} case study`, description: c.title } : {};
}

/** Inventory: one dedicated page per case study (CMS). */
async function CaseStudyPageContent({ params }: { params: PageProps<"/our-works-case-study/[slug]">["params"] }) {
  const { slug } = await params;
  const [c, all] = await Promise.all([getCaseStudy(slug), getCaseStudies()]);
  if (!c) notFound();
  const next = all[(all.findIndex((x) => x.slug === c.slug) + 1) % all.length];
  return <CaseStudyView c={c} next={next} />;
}

/** URL data is read inside Suspense, so navigation to this route can be instant. */
export default function CaseStudyPage({ params }: PageProps<"/our-works-case-study/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CaseStudyPageContent params={params} />
    </Suspense>
  );
}
