import { Suspense } from "react";
import type { Metadata } from "next";
import { getHomeLists } from "@/lib/cms";
import { PageSkeleton } from "@/components/page/blocks";
import { LiveHome } from "@/components/preview/live";
import { previewSession, SignedOut } from "@/components/preview/server";

export const metadata: Metadata = { title: "Homepage preview", robots: { index: false, follow: false } };

// Previews are per-request and never prerendered.
export const instant = false;

/** CMS live preview of the homepage (Website → Homepage in the admin). */
async function HomePreview() {
  const session = await previewSession();
  if (!session) return <SignedOut />;
  const { payload, user } = session;
  const [home, lists] = await Promise.all([
    payload.findGlobal({ slug: "home", depth: 2, overrideAccess: false, user }),
    getHomeLists(),
  ]);
  return <LiveHome initial={home} lists={lists} />;
}

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomePreview />
    </Suspense>
  );
}
