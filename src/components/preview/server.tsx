import Link from "next/link";
import { headers } from "next/headers";
import { connection } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * The signed-in CMS user for a preview request, or null. Previews show
 * drafts, so they are only rendered for someone logged in to the admin
 * (the preview pane sends the admin's cookie).
 */
export async function previewSession() {
  // Per request: verifying the login reads the clock, which must not run while prerendering.
  await connection();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  return user ? { payload, user } : null;
}

export function SignedOut() {
  return (
    <section className="theme-light flex min-h-svh items-center">
      <div className="container-x py-40">
        <p className="t-label">Preview</p>
        <h1 className="t-h2 mt-4">Sign in to the CMS to see this preview.</h1>
        <p className="t-body mt-4 text-fg-2">Previews can show unpublished drafts, so they only open for the MIL team.</p>
        <Link href="/admin" prefetch={false} className="mt-8 inline-block font-medium text-signal underline underline-offset-4">
          Open the CMS
        </Link>
      </div>
    </section>
  );
}
