import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Briefcase, FileClock, FilePenLine, FolderKanban, Images, Inbox, LayoutTemplate, UserRoundSearch } from "lucide-react";
import type { CollectionSlug, ServerProps, Where } from "payload";

type Icon = typeof Inbox;
type Shortcut = { href: string; title: string; text: string; icon: Icon };
type Signal = { href: string; count: number; title: string; empty: string; icon: Icon };

const ROLE_LABEL: Record<string, string> = { admin: "Admin", editor: "Editor", hr: "HR", sales: "Sales" };

/* The three shapes of the MIL logomark (Brand Book 2025), drifting in the banner. */
const MARK = {
  graph: "M0 72V31Q0 26 4 29L28 50L49 22Q52 18 52 24V72Z",
  stem: "M58 30Q58 24 64 24H68Q74 24 74 30V72H58Z",
  scaling: "M82 6Q82 0 88 0H92Q98 0 98 6V50Q98 72 82 72Z",
};

/**
 * Top of the admin dashboard: a branded welcome, what needs attention and
 * shortcuts to everyday tasks. Every count is a real query run with the
 * signed-in user's own access, so each role only sees what it can act on.
 */
export async function Dashboard({ payload, user, permissions }: ServerProps) {
  if (!user || !permissions) return null;
  const admin = payload.config.routes.admin;
  const can = (slug: string, action: "create" | "read" | "update") =>
    Boolean((permissions.collections as Record<string, Record<string, unknown> | undefined> | undefined)?.[slug]?.[action]);

  const count = async (collection: CollectionSlug, where: Where) => {
    try {
      const { totalDocs } = await payload.count({ collection, where, overrideAccess: false, user });
      return totalDocs;
    } catch {
      return null;
    }
  };
  const list = (slug: string, query = "") => `${admin}/collections/${slug}${query}`;

  const shortcuts: Shortcut[] = [
    ...(permissions.globals?.home?.update
      ? [{ href: `${admin}/globals/home`, title: "Update the homepage", text: "Headline, numbers and featured work.", icon: LayoutTemplate }]
      : []),
    ...(can("articles", "create")
      ? [{ href: list("articles", "/create"), title: "Write an article", text: "Save drafts as you go, publish when ready.", icon: FilePenLine }]
      : []),
    ...(can("case-studies", "create")
      ? [{ href: list("case-studies", "/create"), title: "Add a case study", text: "Client, result, story and cover.", icon: FolderKanban }]
      : []),
    ...(can("jobs", "create") ? [{ href: list("jobs", "/create"), title: "Post a job", text: "Shows on the Career page while open.", icon: Briefcase }] : []),
    ...(can("media", "create") ? [{ href: list("media"), title: "Media library", text: "Photos, logos, videos and PDFs.", icon: Images }] : []),
  ];

  const signals: Signal[] = [];
  if (can("leads", "read")) {
    const n = await count("leads", { status: { equals: "new" } });
    if (n !== null)
      signals.push({ href: list("leads", "?where[status][equals]=new"), count: n, title: n === 1 ? "new lead to follow up" : "new leads to follow up", empty: "No new leads. Nice work.", icon: Inbox });
  }
  if (can("job-applications", "read")) {
    const n = await count("job-applications", { status: { equals: "new" } });
    if (n !== null)
      signals.push({ href: list("job-applications", "?where[status][equals]=new"), count: n, title: n === 1 ? "new application to review" : "new applications to review", empty: "No new applications.", icon: UserRoundSearch });
  }
  if (can("jobs", "update")) {
    const n = await count("jobs", { status: { equals: "open" } });
    if (n !== null)
      signals.push({ href: list("jobs", "?where[status][equals]=open"), count: n, title: n === 1 ? "open role on the site" : "open roles on the site", empty: "No open roles. Post one when you're hiring.", icon: Briefcase });
  }
  if (can("articles", "update")) {
    const kinds = [
      { slug: "articles", one: "article", many: "articles" },
      { slug: "case-studies", one: "case study", many: "case studies" },
      { slug: "reports", one: "report", many: "reports" },
    ] as const;
    const drafts = await Promise.all(kinds.map((k) => count(k.slug, { _status: { equals: "draft" } })));
    kinds.forEach((k, i) => {
      const n = drafts[i] ?? 0;
      if (n > 0) signals.push({ href: list(k.slug, "?where[_status][equals]=draft"), count: n, title: `${n === 1 ? k.one : k.many} in draft`, empty: "", icon: FileClock });
    });
    if (drafts.every((d) => !d)) signals.push({ href: list("articles"), count: 0, title: "", empty: "Nothing waiting to be published.", icon: FileClock });
  }

  const u = user as { name?: string | null; roles?: string[] | null };
  const name = u.name?.split(" ")[0];
  const roles = (u.roles ?? []).map((r) => ROLE_LABEL[r] ?? r);
  let i = 0;
  const step = () => ({ "--i": i++ }) as CSSProperties;

  return (
    <section className="mil-dash" aria-label="Start here">
      <header className="mil-hero" style={step()}>
        <span aria-hidden className="mil-hero__mesh" />
        <svg aria-hidden className="mil-hero__mark" viewBox="-6 -6 112 86">
          <defs>
            <linearGradient id="mil-hero-mark" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <g fill="url(#mil-hero-mark)">
            <path className="mil-hero__shape mil-hero__shape--a" d={MARK.graph} />
            <g className="mil-hero__shape mil-hero__shape--b">
              <circle cx="66" cy="9" r="8.5" />
              <path d={MARK.stem} />
            </g>
            <path className="mil-hero__shape mil-hero__shape--c" d={MARK.scaling} />
          </g>
        </svg>
        <div className="mil-hero__body">
          <p className="mil-hero__eyebrow">
            <span aria-hidden className="mil-hero__dot" />
            MIL Digital · Content manager
          </p>
          <h1>{name ? `Hi ${name}, what's next?` : "What's next?"}</h1>
          <p className="mil-hero__lead">Pick a task below, or use the menu on the left. Changes reach the website within seconds.</p>
          {roles.length ? (
            <p className="mil-hero__roles">
              {roles.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </p>
          ) : null}
        </div>
      </header>

      {signals.length ? (
        <div className="mil-dash__signals">
          {signals.map((s) => (
            <Link key={s.href + s.title} href={s.href} className="mil-signal" data-active={s.count > 0} style={step()}>
              <span aria-hidden className="mil-signal__icon">
                <s.icon size={18} strokeWidth={1.8} />
              </span>
              {s.count > 0 ? (
                <span className="mil-signal__text">
                  <strong>{s.count}</strong>
                  <span>{s.title}</span>
                </span>
              ) : (
                <span className="mil-signal__text mil-signal__text--empty">{s.empty}</span>
              )}
              <ArrowUpRight aria-hidden className="mil-signal__arrow" size={16} />
            </Link>
          ))}
        </div>
      ) : null}

      {shortcuts.length ? (
        <>
          <h2 className="mil-dash__label" style={step()}>
            Quick actions
          </h2>
          <div className="mil-dash__grid">
            {shortcuts.map((s) => (
              <Link key={s.href} href={s.href} className="mil-tile" style={step()}>
                <span aria-hidden className="mil-tile__icon">
                  <s.icon size={20} strokeWidth={1.7} />
                </span>
                <strong>{s.title}</strong>
                <span className="mil-tile__text">{s.text}</span>
                <ArrowUpRight aria-hidden className="mil-tile__arrow" size={18} />
              </Link>
            ))}
          </div>
        </>
      ) : null}

      {permissions.globals?.home?.update ? (
        <details className="mil-help" style={step()}>
          <summary>How publishing works</summary>
          <ul>
            <li>
              <b>Articles, case studies and reports</b> save as a draft first. Only the team sees drafts. Press <b>Publish</b> to put it on the
              website; it shows within seconds.
            </li>
            <li>
              To take something down, open it and choose <b>Unpublish</b> from the ⋮ menu. Deleting removes it for good.
            </li>
            <li>
              <b>The homepage, clients, testimonials and jobs</b> have no drafts: pressing Save changes the website straight away.
            </li>
            <li>
              <b>Images:</b> landscape, at least 1600 px wide, under 1 MB. Always fill in the description (alt text), and click the important
              part of the photo to set its focus point so crops keep it in frame.
            </li>
          </ul>
        </details>
      ) : null}
    </section>
  );
}
