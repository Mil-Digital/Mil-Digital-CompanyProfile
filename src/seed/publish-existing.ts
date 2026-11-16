/**
 * One-off migration for enabling drafts on case studies and reports
 * (CMS clean-up, Nov 2026): documents saved before drafts existed get the
 * column default "draft", which would hide them from the website. This
 * publishes each of them once, which also writes their first version.
 * Safe to re-run: already-published documents are skipped.
 *
 *   npx payload run src/seed/publish-existing.ts
 */
import { getPayload } from "payload";
import config from "../payload.config";

const payload = await getPayload({ config });

for (const collection of ["case-studies", "reports"] as const) {
  const { docs } = await payload.find({ collection, where: { _status: { equals: "draft" } }, pagination: false, depth: 0, overrideAccess: true });
  for (const doc of docs) {
    await payload.update({ collection, id: doc.id, data: { _status: "published" }, overrideAccess: true });
  }
  payload.logger.info(`${collection}: published ${docs.length} existing document(s).`);
}
process.exit(0);
