import { Suspense } from "react";
import { PageSkeleton } from "@/components/page/blocks";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReport, getReports } from "@/lib/cms";
import { ReportView } from "@/components/views/report-view";

export async function generateStaticParams() {
  const reports = await getReports();
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/reports/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = await getReport(slug);
  return r ? { title: r.title, description: r.summary } : {};
}

/** Inventory: industry and report detail (CMS); download is gated by a short form. */
async function ReportPageContent({ params }: { params: PageProps<"/reports/[slug]">["params"] }) {
  const { slug } = await params;
  const r = await getReport(slug);
  if (!r) notFound();

  return <ReportView r={r} />;
}

/** URL data is read inside Suspense, so navigation to this route can be instant. */
export default function ReportPage({ params }: PageProps<"/reports/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ReportPageContent params={params} />
    </Suspense>
  );
}
